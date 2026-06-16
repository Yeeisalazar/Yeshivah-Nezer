const DEFAULT_TO_EMAIL = "rabbihillel.aa@gmail.com";
const DEFAULT_FROM_EMAIL = "Yeshivah Nezer <onboarding@resend.dev>";

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function normalizeText(value, fallback = "") {
  return String(value || fallback).trim().slice(0, 8000);
}

function getReplyTo(payload) {
  return normalizeText(payload.email || payload.Correo || payload.correo || payload.replyTo);
}

function buildHtml(subject, message, payload) {
  const rows = Object.entries(payload)
    .filter(([key, value]) => value && typeof value !== "object" && key !== "message")
    .map(
      ([key, value]) =>
        `<tr><th align="left" style="padding:8px;border-bottom:1px solid #e8e0c7;">${escapeHtml(
          key,
        )}</th><td style="padding:8px;border-bottom:1px solid #e8e0c7;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Georgia,'Times New Roman',serif;color:#111;line-height:1.55;">
      <h1 style="margin:0 0 12px;font-size:24px;">${escapeHtml(subject)}</h1>
      <pre style="white-space:pre-wrap;background:#faf8ef;border:1px solid #b9953b;padding:16px;">${escapeHtml(
        message,
      )}</pre>
      ${rows ? `<table style="border-collapse:collapse;width:100%;margin-top:16px;">${rows}</table>` : ""}
    </div>
  `;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    json(res, 503, { ok: false, error: "email_not_configured" });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    json(res, 400, { ok: false, error: "invalid_json" });
    return;
  }

  const to = normalizeText(process.env.CONTACT_TO_EMAIL, DEFAULT_TO_EMAIL);
  const from = normalizeText(process.env.CONTACT_FROM_EMAIL, DEFAULT_FROM_EMAIL);
  const subject = normalizeText(payload.subject, "Yeshivah Nezer - Nuevo formulario");
  const message = normalizeText(payload.message, "Formulario recibido sin mensaje.");
  const replyTo = getReplyTo(payload);

  const emailPayload = {
    from,
    to: [to],
    subject,
    text: message,
    html: buildHtml(subject, message, payload),
  };

  if (replyTo) emailPayload.reply_to = replyTo;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      json(res, 502, { ok: false, error: "email_provider_error", detail: data });
      return;
    }

    json(res, 200, { ok: true, id: data.id });
  } catch {
    json(res, 502, { ok: false, error: "email_send_failed" });
  }
};
