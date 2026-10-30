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
- `design/redesign/` — the redesign kit: `theme.css` (newfront.com structure in the site's navy-and-cream, Instrument Serif + Inter) and `pages.mjs` (all 12 pages as static HTML with the current copy). Not part of the Astro build; it feeds the Figma file and the browser preview
- `tools/figma-export.mjs` — renders pages as self-contained HTML for Figma's html_to_figma (`--design` for the redesign kit, `--preview` for plain HTML to open in a browser)

Sales-copy rules live in `AGENTS.md`.

## Commands

```bash
npm install
npm run dev        # http://127.0.0.1:4321
npm run build      # static output in dist/client
npm run preview    # build, then serve through wrangler dev
npm run check      # astro check (TypeScript)
npm run deploy     # build, then wrangler deploy
node tools/figma-export.mjs design/redesign/preview --design --preview   # redesign kit as HTML; serve the repo root to view
node tools/figma-export.mjs <outDir> --design                            # redesign kit for Figma (desktop + mobile per page)
```

## Still to port

`about`, `review`, `privacy`, `reach-more-customers`, `convert-more-inquiries`, `build-repeat-business`, `measure-and-improve`, `local-seo`, `websites`. Then: Keystatic for news posts, the form handler on D1 + Turnstile + Resend, and Access-protected staff pages.
