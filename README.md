# Noah Garcia Portfolio — Canva Exact Frontend

This version treats `NOAHGARCIA(1).pdf` as the visual source of truth.

## Design
- Single-page EJS composition loaded from `src/page.html`
- Reusable EJS components live in `src/components`
- All layout and visual styling is authored and served directly from the single `src/global.css` file
- Client behavior is organized in `src/layout.js`
- The hero presents the portrait and background artwork above the name, role, and actions
- Portfolio content is defined directly in its components

## Animation sequence
1. Black intro screen.
2. `NOAHGARCIA` appears one letter at a time from N through A with a restrained flicker.
3. The intro changes to the portfolio background.
4. Noah's portrait appears centered as the second visual stage.
5. The portrait moves into the hero's original right-side location.
6. Hero text and buttons appear after the portrait settles.
7. About, Creations, and Contact content reveal as the visitor scrolls.
8. Creations tabs animate between Projects, Certificates, and Tech Stack.

## Run locally
```bash
npm install
npm run build
```

Open `index.html` in a browser, or serve the folder with any static file server.
The build creates the deployable `index.html` from the EJS source components.

## Static/serverless deployment

This project does not use an API, server function, database, or Node server in
production. It is a static site and can be deployed directly from the repository:

- **GitHub Pages:** enable Pages with the repository root as the source.
- **Netlify:** publish the repository root (`.`) and use `npm run build` as the
  build command.
- **Vercel:** use the included `vercel.json`; it runs the static build and serves
  the repository root.

The `assets/` directory must be deployed together with `index.html`.

## EmailJS contact form
The contact form sends directly through the EmailJS browser SDK and does not save submissions to the local JSON data file.

Create an EmailJS service and email template, then add these variables to the root `.env` file:

```dotenv
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
```

Then run `npm run build` with those environment variables in the hosting
provider. EmailJS runs in the browser; no serverless function is needed.

The EmailJS template should use `{{name}}`, `{{from_mail}}`, and `{{message}}`. The matching form field names are `name`, `from_mail`, and `message`.

The form also limits message length, includes a hidden honeypot field, and applies a 30-second cooldown after a successful submission to reduce automated spam. Configure EmailJS dashboard rate limits as the server-side protection for the public browser key.
