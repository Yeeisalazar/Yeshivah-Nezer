# Yeshivah Nezer

Sitio estático para cursos, biografía, cartas de recomendación, contacto, donativos y carrito de inscripción.

## Archivos principales

- `index.html`: estructura del sitio y formularios.
- `styles.css`: diseño responsive en blanco, negro y dorado.
- `app.js`: cursos, precios, carrito, donativos, contacto y flujo de checkout.
- `assets/`: logo, fotografías del rabino y cartas de recomendación.

## Datos configurados

En `app.js`:

```js
const SITE_CONFIG = {
  siteName: "Yeshivah Nezer",
  ownerEmail: "rabbihillel.aa@gmail.com",
  emailEndpoint: "",
  webpayEndpoint: "",
  webpayFallbackLink: "",
  currency: "CLP",
};
```

Los cursos y donativos están expresados como montos finales en pesos chilenos para Webpay.

## Webpay

El sitio ya tiene el flujo visual solicitado:

1. El alumno agrega cursos o donativos al carrito.
2. Completa un formulario con nombre, correo, teléfono, ubicación y comentarios.
3. Presiona `Generar link Webpay`.

Para que el pago con tarjeta funcione en producción, falta conectar `webpayEndpoint` a un backend o servicio que cree la transacción Webpay. Ese backend debe devolver una de estas dos respuestas:

```json
{ "paymentUrl": "https://..." }
```

o:

```json
{ "url": "https://webpay...", "token": "token_ws..." }
```

Mientras no exista ese endpoint, el sitio prepara el pedido y abre un correo dirigido a `rabbihillel.aa@gmail.com` con el detalle.

## Formularios de contacto

Los formularios están configurados para enviar los datos por `POST` a `/api/contact`. Ese endpoint debe implementarse en el hosting/backend y enviar el correo a `rabbihillel.aa@gmail.com`.
# Yeshivah-Nezer
