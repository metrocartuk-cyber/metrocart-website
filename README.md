# Metrocart static website

This is a standalone HTML, CSS, and JavaScript recreation of the Metrocart WordPress theme. It does not require WordPress, PHP, a database, or a build step.

## Run locally

Open `index.html` directly in a browser, or serve this folder with any static file server. For example:

```powershell
npx serve .
```

## Project structure

- `index.html` — all five website views and semantic content
- `assets/css/style.css` — responsive presentation and motion styling
- `assets/js/main.js` — navigation, catalogue filtering, forms, canvas effects, and motion

The website uses remote Google Fonts, GSAP, the supplied Metrocart logo URL, and Unsplash catalogue imagery. Core navigation and filtering continue to work if GSAP is unavailable.

