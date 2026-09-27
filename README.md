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

## Enquiry forms (Web3Forms)

The Food, Consultancy, and Legal enquiry forms post to [Web3Forms](https://web3forms.com), so the site stays fully static on GitHub Pages with no PHP or SMTP credentials.

**Setup:**

1. On web3forms.com, create an access key using the mailbox that should receive enquiries (currently `fazil.abbas@metrocart.co.uk`).
2. Paste the key into `mcFormKey` near the top of `index.html`, replacing `YOUR_WEB3FORMS_ACCESS_KEY`.
3. Commit, push, and send a labelled test enquiry from each form on the live site.

**How it works:**

- The destination mailbox is set by the access key only. Changing the footer email does not change where enquiries go; to change the recipient, create a new key.
- The access key is designed to be public. Never commit private email passwords or SMTP credentials.
- The visitor's `email` field becomes the Reply-To address, so replying to an enquiry email answers the visitor.
- Each form sends its own subject (`Website: Food trade enquiry from <company>`, and so on) plus all of its fields.
- A hidden `botcheck` honeypot rejects basic spam bots.
- Success is shown only when Web3Forms confirms receipt. On error or after a 20-second timeout, the visitor's input is kept and they are pointed to phone or WhatsApp. Submissions are never retried automatically.
- The free plan allows 250 submissions per month.

The website uses remote Google Fonts, GSAP, the supplied Metrocart logo URL, and Unsplash catalogue imagery. Core navigation and filtering continue to work if GSAP is unavailable.

