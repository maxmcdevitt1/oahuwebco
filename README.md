# oahuwebco.com

The Oahu Web Co. website, moving from hand-written HTML to Astro 7 with Tailwind CSS v4, served from a Cloudflare Worker.

## Layout

- `src/pages/` — one `.astro` file per URL (`index`, `thanks`, `404` so far)
- `src/layouts/Base.astro` — `<head>`, Content-Security-Policy, Google Analytics, Lenis smooth scroll
- `src/components/` — `Hero`, `Island`, `Brand`, `Footer`, `ContactForm`, `Notice`
- `src/lib/site.ts` — business facts (name, phone, email, social links, services) and the schema.org business node
- `src/styles/global.css` — Tailwind v4 theme tokens plus the inherited navy-and-cream stylesheet
- `public/` — fonts, logos, verification files, `robots.txt`, `llms.txt`, `ga.js`, `CNAME`
- `legacy/` — the original static pages, kept as the reference while each one is ported; delete when the port is complete

Sales-copy rules live in `AGENTS.md`.

## Commands

```bash
npm install
npm run dev        # http://127.0.0.1:4321
npm run build      # static output in dist/client
npm run preview    # build, then serve through wrangler dev
npm run check      # astro check (TypeScript)
npm run deploy     # build, then wrangler deploy
```

## Still to port

`about`, `review`, `privacy`, `reach-more-customers`, `convert-more-inquiries`, `build-repeat-business`, `measure-and-improve`, `local-seo`, `websites`. Then: Keystatic for news posts, the form handler on D1 + Turnstile + Resend, and Access-protected staff pages.
