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
  emailEndpoint: "/api/contact",
  webpayEndpoint: "",
  webpayFallbackLink: "",
  currency: "USD",
};
```

Los cursos y donativos se muestran en dólares estadounidenses para que la oferta sea más universal. Cuando se conecte Webpay, el backend deberá convertir el total USD a pesos chilenos antes de crear la transacción, porque Webpay procesa pagos locales en CLP.

La sección de requisitos está incluida en la página y los testimonios usan las fotografías reales de alumnos dentro de avatares circulares.

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
