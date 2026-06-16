const SITE_CONFIG = {
  siteName: "Yeshivah Nezer",
  ownerEmail: "rabbihillel.aa@gmail.com",
  emailEndpoint: "/api/contact",
  whatsappNumber: "56993001241",
  currency: "USD",
};

const COURSES = [
  {
    id: "shejita-ofoth",
    title: "Shejitá Ofoth",
    summary:
      "Curso teórico y práctico sobre las halajot de la shejitá de aves, incluyendo anatomía básica, revisión del cuchillo (bedikat sakin), fundamentos de kashrut y principios esenciales del proceso de shejitá según la halajá tradicional.",
    languages: ["Español", "Inglés"],
    duration: "6 meses",
    mode: "Teórico y práctico",
    level: "Formación especializada",
    prices: {
      regular: 400,
      jevruta: 300,
    },
  },

  {
    id: "rav-umanhig",
    title: "Rav uManhig",
    summary:
      "Formación enfocada en liderazgo comunitario, orientación espiritual y responsabilidad rabínica. El curso aborda halajá práctica relacionada con el servicio comunitario, actividades de sinagoga, acompañamiento pastoral, ética rabínica y construcción de comunidad.",
    languages: ["Español", "Inglés"],
    duration: "1 año",
    mode: "Formación guiada",
    level: "Liderazgo comunitario",
    prices: {
      regular: 500,
      jevruta: 350,
    },
  },
  {
    id: "yoreh-yoreh",
    title: "Yoreh Yoreh",
    summary:
      "Programa de estudio halájico centrado en áreas fundamentales de Yoreh Deá, incluyendo kashrut, bishul akum, taarovot, nidá y otras áreas esenciales para la vida judía observante y la formación rabínica.",
    languages: ["Español", "Inglés"],
    duration: "3 años",
    mode: "Programa halájico",
    level: "Avanzado",
    prices: {
      regular: 650,
      jevruta: 350,
    },
  },
  {
    id: "yoetzet-halaja",
    title: "Yoetzet Halajá",
    summary:
      "Curso enfocado y diseñado para mujeres, dedicado al estudio de taharat hamishpajá y acompañamiento halájico sensible y responsable, con énfasis en claridad práctica, comprensión humana y transmisión respetuosa de la halajá.",
    languages: ["Español", "Inglés"],  
    duration: "1 año",
    mode: "Diseñado para mujeres",
    level: "Formación aplicada",
    prices: {
      regular: 450,
      jevruta: 350,
    },
  },
];

const STORAGE_KEY = "yeshivah-nezer-cart-v3";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  courseGrid: $("#course-grid"),
  cartDrawer: $("#cart-drawer"),
  openCart: $("#open-cart"),
  closeCart: $("#close-cart"),
  clearCart: $("#clear-cart"),
  cartItems: $("#cart-items"),
  cartCount: $("#cart-count"),
  cartTotal: $("#cart-total"),
  checkoutForm: $("#checkout-form"),
  donationForm: $("#donation-form"),
  customDonation: $("#custom-donation"),
  menuButton: $("#menu-button"),
  siteNav: $("#site-nav"),
  toast: $("#toast"),
  header: $("#top"),
};

let cart = loadCart();
let selectedDonationAmount = 18;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(amount) {
  return `US$ ${Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function renderSiteName() {
  $$("[data-site-name]").forEach((node) => {
    node.textContent = SITE_CONFIG.siteName;
  });
}

function renderCourses() {
  elements.courseGrid.innerHTML = COURSES.map(
    (course) => `
      <article class="course-card" data-aos="fade-up">
        <div>
          <div class="course-meta">
            ${course.languages.map((language) => `<span class="pill">${escapeHtml(language)}</span>`).join("")}
          </div>
          <h3>${escapeHtml(course.title)}</h3>
          <p>${escapeHtml(course.summary)}</p>
        </div>
        <ul class="course-details">
          <li><span>Duración</span><strong>${escapeHtml(course.duration)}</strong></li>
          <li><span>Modalidad</span><strong>${escapeHtml(course.mode)}</strong></li>
          <li><span>Nivel</span><strong>${escapeHtml(course.level)}</strong></li>
        </ul>
        <div>
          <label class="track-selector">
            Modalidad de inscripción
            <select data-course-track="${course.id}">
              <option value="regular">Individual - ${formatMoney(course.prices.regular)}</option>
              <option value="jevruta">Con jevruta - ${formatMoney(course.prices.jevruta)}</option>
            </select>
          </label>
          <div class="course-price">
            Desde ${formatMoney(course.prices.jevruta)}
            <span class="price-note">Valor individual: ${formatMoney(course.prices.regular)}</span>
          </div>
          <div class="card-actions">
            <button class="button primary" type="button" data-buy-course="${course.id}">Solicitar inscripción</button>
            <button class="button outline" type="button" data-add-course="${course.id}">Agregar al carrito</button>
          </div>
        </div>
      </article>
    `,
  ).join("");
}

function courseById(courseId) {
  return COURSES.find((course) => course.id === courseId);
}

function selectedCourseItem(courseId) {
  const course = courseById(courseId);
  if (!course) return null;
  const track = document.querySelector(`[data-course-track="${courseId}"]`)?.value || "regular";
  const trackLabel = track === "jevruta" ? "Con jevruta" : "Individual";
  const price = course.prices[track];

  return {
    id: `${course.id}-${track}`,
    courseId: course.id,
    name: `${course.title} - ${trackLabel}`,
    price,
    quantity: 1,
    type: "course",
    track,
  };
}

function addToCart(item, open = true) {
  const existing = cart.find((line) => line.id === item.id);
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }
  saveCart();
  renderCart();
  if (open) openCart();
}

function setDirectBuy(item) {
  cart = [{ ...item, quantity: 1 }];
  saveCart();
  renderCart();
  openCart();
  showToast("Completa tus datos para enviar la solicitud al rabino.");
  elements.checkoutForm.querySelector("input[name='name']")?.focus();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartTotal();

  elements.cartCount.textContent = count;
  elements.cartTotal.textContent = formatMoney(total);

  if (!cart.length) {
    elements.cartItems.innerHTML = `<div class="empty-state">El carrito está vacío.</div>`;
    return;
  }

  elements.cartItems.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-line">
          <div class="cart-line-title">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${formatMoney(item.price * item.quantity)}</span>
          </div>
          <div class="cart-line-actions">
            <button class="quantity-button" type="button" data-decrease="${item.id}" aria-label="Restar">−</button>
            <strong>${item.quantity}</strong>
            <button class="quantity-button" type="button" data-increase="${item.id}" aria-label="Sumar">+</button>
            <button class="remove-line" type="button" data-remove="${item.id}">Quitar</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function openCart() {
  elements.cartDrawer.classList.add("is-open");
  elements.cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  elements.cartDrawer.classList.remove("is-open");
  elements.cartDrawer.setAttribute("aria-hidden", "true");
}

function updateQuantity(itemId, amount) {
  const item = cart.find((line) => line.id === itemId);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) {
    cart = cart.filter((line) => line.id !== itemId);
  }
  saveCart();
  renderCart();
}

function removeLine(itemId) {
  cart = cart.filter((line) => line.id !== itemId);
  saveCart();
  renderCart();
}

function createOrder(customer) {
  return {
    id: `YN-${Date.now()}`,
    site: SITE_CONFIG.siteName,
    currency: SITE_CONFIG.currency,
    total: cartTotal(),
    items: cart.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      type: item.type,
      track: item.track || "",
    })),
    customer,
    createdAt: new Date().toISOString(),
  };
}

function orderToText(order) {
  const lines = [
    `Pedido: ${order.id}`,
    `Sitio: ${order.site}`,
    `Total: ${formatMoney(order.total)}`,
    "",
    "Datos del alumno/donante:",
    `Nombre: ${order.customer.name}`,
    `Correo: ${order.customer.email}`,
    `Teléfono: ${order.customer.phone}`,
    `Ubicación: ${order.customer.location}`,
    `Comentarios: ${order.customer.notes || "Sin comentarios"}`,
    "",
    "Detalle:",
    ...order.items.map(
      (item) => `- ${item.name} x${item.quantity}: ${formatMoney(item.price * item.quantity)}`,
    ),
  ];
  return lines.join("\n");
}

function createMailtoUrl(subject, message) {
  const params = new URLSearchParams({ subject, body: message });
  return `mailto:${SITE_CONFIG.ownerEmail}?${params.toString()}`;
}

function createWhatsappUrl(message) {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?${params.toString()}`;
}

async function sendEmailNotification(subject, message, payload = {}) {
  if (!SITE_CONFIG.emailEndpoint) return false;

  try {
    const response = await fetch(SITE_CONFIG.emailEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: SITE_CONFIG.ownerEmail,
        subject,
        message,
        ...payload,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function submitEnrollmentRequest(event) {
  event.preventDefault();

  if (!cart.length) {
    showToast("Agrega un curso o donativo antes de enviar la solicitud.");
    return;
  }

  if (!elements.checkoutForm.reportValidity()) return;

  const formData = new FormData(elements.checkoutForm);
  const customer = Object.fromEntries(formData.entries());
  const order = createOrder(customer);
  const subject = `${SITE_CONFIG.siteName} - Solicitud de inscripción ${order.id}`;
  const message = orderToText(order);
  const whatsappMessage = `${subject}\n\n${message}`;
  const whatsappWindow = window.open(createWhatsappUrl(whatsappMessage), "_blank", "noopener");

  showToast("Enviando solicitud al rabino...");
  const emailSent = await sendEmailNotification(subject, message, {
    formType: "checkout",
    order,
  });

  if (emailSent) {
    showToast(whatsappWindow ? "Solicitud enviada y WhatsApp abierto." : "Solicitud enviada al correo del rabino.");
    return;
  }

  window.location.href = createMailtoUrl(subject, message);
  showToast("Se abrió WhatsApp y un correo de respaldo para completar la solicitud.");
}

function selectDonationAmount(button) {
  $$("[data-donation-amount]").forEach((node) => node.classList.remove("is-selected"));
  button.classList.add("is-selected");
  selectedDonationAmount = Number(button.dataset.donationAmount);
  elements.customDonation.value = "";
}

function addDonation(event) {
  event.preventDefault();
  const customAmount = Number(elements.customDonation.value || 0);
  const amount = customAmount > 0 ? customAmount : selectedDonationAmount;

  addToCart({
    id: `donation-${Date.now()}`,
    name: "Donativo a la Yeshivah",
    price: amount,
    quantity: 1,
    type: "donation",
  });
  showToast("Donativo agregado al carrito.");
}

async function submitEmailForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const label = form.dataset.formLabel || "Formulario";
  const payload = Object.fromEntries(formData.entries());
  const subject = `${SITE_CONFIG.siteName} - ${label}`;
  const body = Object.entries(payload)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  const message = `${body}\n\nDestino: ${SITE_CONFIG.ownerEmail}`;

  const emailSent = await sendEmailNotification(subject, message, {
    formType: label,
    ...payload,
  });

  if (emailSent) {
    form.reset();
    showToast("Mensaje enviado correctamente.");
    return;
  }

  window.location.href = createMailtoUrl(subject, message);
  showToast("No se pudo enviar automáticamente; se abrió un correo de respaldo.");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 3000);
}

function bindEvents() {
  elements.courseGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-course]");
    const buyButton = event.target.closest("[data-buy-course]");
    const courseId = addButton?.dataset.addCourse || buyButton?.dataset.buyCourse;
    if (!courseId) return;

    const item = selectedCourseItem(courseId);
    if (!item) return;

    if (buyButton) {
      setDirectBuy(item);
      return;
    }

    addToCart(item);
    showToast("Curso agregado al carrito.");
  });

  elements.openCart.addEventListener("click", openCart);
  elements.closeCart.addEventListener("click", closeCart);
  elements.cartDrawer.addEventListener("click", (event) => {
    if (event.target === elements.cartDrawer) closeCart();
  });

  elements.cartItems.addEventListener("click", (event) => {
    const increase = event.target.closest("[data-increase]");
    const decrease = event.target.closest("[data-decrease]");
    const remove = event.target.closest("[data-remove]");

    if (increase) updateQuantity(increase.dataset.increase, 1);
    if (decrease) updateQuantity(decrease.dataset.decrease, -1);
    if (remove) removeLine(remove.dataset.remove);
  });

  elements.clearCart.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });

  $$("[data-donation-amount]").forEach((button, index) => {
    if (index === 0) button.classList.add("is-selected");
    button.addEventListener("click", () => selectDonationAmount(button));
  });

  elements.customDonation.addEventListener("input", () => {
    $$("[data-donation-amount]").forEach((node) => node.classList.remove("is-selected"));
  });

  elements.donationForm.addEventListener("submit", addDonation);
  elements.checkoutForm.addEventListener("submit", submitEnrollmentRequest);

  $$("[data-email-form]").forEach((form) => {
    form.addEventListener("submit", submitEmailForm);
  });

  elements.menuButton.addEventListener("click", () => {
    const isOpen = elements.siteNav.classList.toggle("is-open");
    elements.menuButton.setAttribute("aria-expanded", String(isOpen));
    elements.header.classList.toggle("is-menu-open", isOpen);
  });

  elements.siteNav.addEventListener("click", () => {
    elements.siteNav.classList.remove("is-open");
    elements.menuButton.setAttribute("aria-expanded", "false");
    elements.header.classList.remove("is-menu-open");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });
}

function updateHeaderState() {
  elements.header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function initScrollAnimations() {
  const animatedSelectors = [
    ".values-band article",
    ".section-heading",
    ".requirement-card",
    ".service-card",
    ".bio-gallery",
    ".bio-copy",
    ".testimonial-card",
    ".recommendation-panel > div",
    ".donation-box",
    ".contact-copy",
    ".contact-form",
  ];

  document.querySelectorAll(animatedSelectors.join(",")).forEach((node, index) => {
    node.dataset.aos ||= index % 2 === 0 ? "fade-up" : "fade-right";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
  );

  document.querySelectorAll("[data-aos]").forEach((node) => observer.observe(node));
}

renderSiteName();
renderCourses();
renderCart();
bindEvents();
updateHeaderState();
initScrollAnimations();
window.addEventListener("scroll", updateHeaderState, { passive: true });
