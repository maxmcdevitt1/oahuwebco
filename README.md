# oahuwebco.com

The Oahu Web Co. website: Astro 7 with Tailwind CSS v4, built to static HTML and served by GitHub Pages at oahuwebco.com. The redesign (October 2026) lives here; the hand-written pages it replaces are in `legacy/`.

## Layout

- `src/pages/` — one `.astro` file per URL, all twelve pages
- `src/layouts/Base.astro` — `<head>`, Content-Security-Policy, Google Analytics, Lenis smooth scroll; `Service.astro` — the six service pages (hero, visual + numbered problems, questions, closing band, schema)
- `src/components/` — `Header` (fixed bar that hides on the way down), `Hero` (full height, drifts under the first sheet), `Island`, `Divider` (hairline with the travelling accent), `Ticker` (auto-scrolling cards), `Photo` (photo fixed behind the page, seen through a window the next sheet slides over; files and credits in `src/assets/photos/`), `Section`, `Faq`, `ServiceRows`, `Footer` (closing serif line + link card), `ContactForm`, `Notice`
- `src/scripts/motion.ts` — Lenis smoothing, header hide/show, hero and media parallax, divider in-view, scroller arrows, back-to-top
- `src/lib/site.ts` — business facts (name, phone, email, social links, services) and the schema.org business node
- `src/styles/global.css` — Tailwind v4 theme tokens plus the redesign stylesheet (newfront.com structure in navy and cream, Instrument Serif + Inter), ported from `design/redesign/theme.css`
- `public/` — fonts, logos, verification files, `robots.txt`, `llms.txt`, `ga.js`, `CNAME`
- `legacy/` — the original static pages, kept as the copy reference; every page is ported now, so this folder can go once the redesign ships
- `design/redesign/` — the redesign kit: `theme.css` (newfront.com structure in the site's navy-and-cream, Instrument Serif + Inter) and `pages.mjs` (all 12 pages as static HTML with the current copy). Not part of the Astro build; it feeds the Figma file and the browser preview
- `tools/figma-export.mjs` — renders pages as self-contained HTML for Figma's html_to_figma (`--design` for the redesign kit, `--preview` for plain HTML to open in a browser)

Sales-copy rules live in `AGENTS.md`.

## Commands

```bash
npm install
npm run dev        # http://127.0.0.1:4321
npm run build      # static output in dist/
npm run preview    # build, then serve dist/ locally
npm run check      # astro check (TypeScript)
node tools/figma-export.mjs design/redesign/preview --design --preview   # redesign kit as HTML; serve the repo root to view
node tools/figma-export.mjs <outDir> --design                            # redesign kit for Figma (desktop + mobile per page)
node tools/figma-export.mjs <outDir>                                     # the built site (run npm run build first)
```

## Deploying

Pushes to `main` run `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages (the repository's Pages source must be set to "GitHub Actions"). `public/CNAME` keeps the custom domain. The contact form posts to FormSubmit, so no server is needed.
