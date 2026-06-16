# Yeshivah Nezer

Sitio estático para cursos, biografía, cartas de recomendación, contacto, donativos y carrito de inscripción.

## Archivos principales

- `index.html`: estructura del sitio y formularios.
- `styles.css`: diseño responsive en blanco, negro y dorado.
- `app.js`: cursos, precios, carrito, donativos, contacto y flujo de checkout.
- `api/contact.js`: función serverless de Vercel para enviar formularios por correo.
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

Los formularios están configurados para enviar los datos por `POST` a `/api/contact`. Ese endpoint usa Resend desde Vercel y envía el correo a `rabbihillel.aa@gmail.com`. Mientras Resend no tenga API key configurada, el sitio mantiene el respaldo por WhatsApp y correo del usuario.

Variables necesarias en Vercel:

```txt
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=rabbihillel.aa@gmail.com
CONTACT_FROM_EMAIL=Yeshivah Nezer <contacto@yeshivanezer.org>
```

`CONTACT_FROM_EMAIL` debe pertenecer a un dominio verificado en Resend. Para pruebas se puede usar temporalmente `Yeshivah Nezer <onboarding@resend.dev>`.

## Dominio

Dominio final: `yeshivanezer.org`.

En Vercel hay que agregar:

- `yeshivanezer.org`
- `www.yeshivanezer.org`

DNS recomendado:

- Apex/root `yeshivanezer.org`: registro `A` apuntando a `76.76.21.21`.
- Subdominio `www`: registro `CNAME` apuntando al valor que indique Vercel para el proyecto.

Despues de cambiar las DNS, Vercel emitira SSL automaticamente cuando detecte los registros correctos.
# Yeshivah-Nezer
