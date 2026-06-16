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
  whatsappNumber: "56993001241",
  currency: "USD",
};
```

Los cursos y donativos se muestran en dólares estadounidenses para que la oferta sea más universal. El carrito no procesa pagos; genera una solicitud directa al rabino.

La sección de requisitos está incluida en la página y los testimonios usan las fotografías reales de alumnos dentro de avatares circulares.

## Flujo de contacto

El sitio usa un flujo combinado:

1. El alumno agrega cursos o donativos al carrito.
2. Completa un formulario con nombre, correo, teléfono, ubicación y comentarios.
3. Presiona `Enviar solicitud al rabino`.
4. El sitio intenta enviar la solicitud a `rabbihillel.aa@gmail.com` usando `/api/contact`.
5. También abre WhatsApp con el mensaje armado para `+56 9 9300 1241`.
6. Si `/api/contact` aún no está conectado, abre un correo de respaldo con el mismo detalle.

## Formularios de contacto

Los formularios están configurados para enviar los datos por `POST` a `/api/contact`. Ese endpoint debe implementarse en el hosting/backend y enviar el correo a `rabbihillel.aa@gmail.com`. Mientras tanto, el sitio abre un correo de respaldo dirigido a esa misma dirección.
# Yeshivah-Nezer
