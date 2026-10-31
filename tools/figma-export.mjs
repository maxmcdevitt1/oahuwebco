// Turns each site page into a self-contained HTML document that Figma's html_to_figma can render
// without network access: stylesheets, fonts and images inlined as data URIs, scripts and the CSP
// removed, media queries resolved for a fixed width, and vw/vh units converted to pixels.
//
//   node tools/figma-export.mjs <outDir>                      the built site (dist/client)
//   node tools/figma-export.mjs <outDir> --design             redesign kit (design/redesign/pages.mjs)
//   node tools/figma-export.mjs <outDir> --design --preview   redesign kit as plain HTML for a browser
//
// Pages are read from dist/client (run `npm run build` first). Output: <outDir>/<slug>.<desktop|mobile>.html (preview: <outDir>/<slug>.html)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith("--"));
const design = args.includes("--design");
const preview = args.includes("--preview");
if (!outDir) throw new Error("usage: node tools/figma-export.mjs <outDir> [--design] [--preview]");
mkdirSync(outDir, { recursive: true });

const sitePages = [
  { slug: "home", title: "Home", file: "dist/client/index.html" },
  { slug: "about", title: "About", file: "dist/client/about/index.html" },
  { slug: "reach-more-customers", title: "Reach more customers", file: "dist/client/reach-more-customers/index.html" },
  { slug: "convert-more-inquiries", title: "Convert more inquiries", file: "dist/client/convert-more-inquiries/index.html" },
  { slug: "build-repeat-business", title: "Build repeat business", file: "dist/client/build-repeat-business/index.html" },
  { slug: "measure-and-improve", title: "Measure and improve", file: "dist/client/measure-and-improve/index.html" },
  { slug: "local-seo", title: "Local SEO", file: "dist/client/local-seo/index.html" },
  { slug: "websites", title: "Websites", file: "dist/client/websites/index.html" },
  { slug: "review", title: "Leave a review", file: "dist/client/review/index.html" },
  { slug: "privacy", title: "Privacy policy", file: "dist/client/privacy/index.html" },
  { slug: "thanks", title: "Thanks", file: "dist/client/thanks/index.html" },
  { slug: "404", title: "404", file: "dist/client/404.html" },
];

const viewports = {
  desktop: { w: 1440, h: 900 },
  mobile: { w: 390, h: 844 },
};

const mime = {
  ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".css": "text/css",
};

/** Map a site URL to a file on disk across the source trees (public, build, legacy, repo root). */
function resolveAsset(url) {
  const clean = url.replace(/^["']|["']$/g, "").split(/[?#]/)[0];
  const path = clean.startsWith("/") ? clean : "/" + clean;
  const candidates = [
    join(root, "public", path),
    join(root, "dist/client", path),
    join(root, "legacy", path),
    join(root, path), // /design/… and /node_modules/… (redesign kit)
  ];
  return candidates.find((p) => existsSync(p));
}

function dataUri(url) {
  const file = resolveAsset(url);
  if (!file) return null;
  const type = mime[extname(file).toLowerCase()];
  if (!type) return null;
  return `data:${type};base64,${readFileSync(file).toString("base64")}`;
}

/** Find the index of the brace that closes the block opened at `open`. */
function closingBrace(css, open) {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return i;
  }
  return -1;
}

/** Resolve @media and @supports blocks for a fixed viewport width. */
function resolveAtRules(css, w) {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf("@", i);
    if (at === -1) { out += css.slice(i); break; }
    const m = /^@(media|supports)\b([^{]*)\{/.exec(css.slice(at));
    if (!m) { out += css.slice(i, at + 1); i = at + 1; continue; }
    out += css.slice(i, at);
    const open = at + m[0].length - 1;
    const close = closingBrace(css, open);
    const inner = css.slice(open + 1, close);
    const cond = m[2];
    let keep;
    if (m[1] === "supports") {
      keep = !/animation-timeline/.test(cond) && !/animation-timeline/.test(inner);
      if (keep) out += `@supports${cond}{${resolveAtRules(inner, w)}}`;
    } else {
      const max = /max-width\s*:\s*(\d+)px|width\s*<=\s*(\d+)px/.exec(cond);
      const min = /min-width\s*:\s*(\d+)px|width\s*>=\s*(\d+)px/.exec(cond);
      if (/prefers-reduced-motion|print/.test(cond)) keep = false;
      else if (max) keep = w <= Number(max[1] ?? max[2]);
      else if (min) keep = w >= Number(min[1] ?? min[2]);
      else keep = true;
      if (keep) out += resolveAtRules(inner, w);
    }
    i = close + 1;
  }
  return out;
}

function processCss(css, vp) {
  css = css.replace(/url\(\s*([^)]+?)\s*\)/g, (whole, u) => {
    if (/^["']?data:/.test(u)) return whole;
    const d = dataUri(u);
    return d ? `url("${d}")` : whole;
  });
  css = resolveAtRules(css, vp.w);
  css = css.replace(/(\d*\.?\d+)vw\b/g, (_, n) => `${(Number(n) * vp.w) / 100}px`);
  css = css.replace(/(\d*\.?\d+)(?:svh|dvh|vh)\b/g, (_, n) => `${(Number(n) * vp.h) / 100}px`);
  css = resolveMath(css);
  return css;
}

/** Collapse min()/max()/clamp() whose arguments are all px, which the Figma renderer leaves unresolved. */
function resolveMath(css) {
  const px = /^\s*(-?\d*\.?\d+)px\s*$/;
  const fn = /\b(min|max|clamp)\(([^()]*)\)/g;
  let prev;
  do {
    prev = css;
    css = css.replace(fn, (whole, name, args) => {
      const nums = args.split(",").map((a) => px.exec(a)?.[1]).map((v) => (v == null ? NaN : Number(v)));
      if (nums.some(Number.isNaN)) return whole;
      if (name === "min") return `${Math.min(...nums)}px`;
      if (name === "max") return `${Math.max(...nums)}px`;
      if (nums.length !== 3) return whole;
      const [lo, mid, hi] = nums;
      return `${Math.min(Math.max(mid, lo), hi)}px`;
    });
  } while (css !== prev);
  return css;
}

function processHtml(html, vp) {
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<meta[^>]+Content-Security-Policy[^>]*>/gi, "");
  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    const rel = /rel=["']?([^"' >]+)/i.exec(tag)?.[1];
    const href = /href=["']?([^"' >]+)/i.exec(tag)?.[1];
    if (rel !== "stylesheet" || !href) return "";
    const file = resolveAsset(href);
    if (!file) return "";
    return `<style>${processCss(readFileSync(file, "utf8"), vp)}</style>`;
  });
  html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => `<style>${processCss(css, vp)}</style>`);
  html = html.replace(/<img\b([^>]*?)\ssrc=["']([^"']+)["']/gi, (whole, attrs, src) => {
    const d = dataUri(src);
    return d ? `<img${attrs} src="${d}"` : whole;
  });
  // Fixed width, no scripts, and the phone menu stays closed
  const override = `<style>
html,body{width:${vp.w}px!important;min-width:${vp.w}px;max-width:${vp.w}px;margin:0;overflow-x:hidden}
</style>`;
  return html.replace(/<\/head>/i, `${override}</head>`);
}

const pages = design
  ? (await import("../design/redesign/pages.mjs")).pages.map((p) => ({ slug: p.slug, title: p.title, html: p.html(preview ? "/public" : "") }))
  : sitePages.map((p) => ({ slug: p.slug, title: p.title, html: readFileSync(join(root, p.file), "utf8") }));

const results = [];
for (const page of pages) {
  if (preview) {
    const file = join(outDir, `${page.slug}.html`);
    writeFileSync(file, page.html);
    results.push({ page: page.title, file, kb: Math.round(page.html.length / 1024) });
    continue;
  }
  for (const [name, vp] of Object.entries(viewports)) {
    const out = processHtml(page.html, vp);
    const file = join(outDir, `${page.slug}.${name}.html`);
    writeFileSync(file, out);
    results.push({ page: page.title, viewport: name, file, kb: Math.round(out.length / 1024) });
  }
}
console.table(results);
