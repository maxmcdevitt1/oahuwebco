// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://oahuwebco.com',
  // Static output for GitHub Pages. The live site's URLs end in a slash (/about/), so pages build as /about/index.html
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
    // Let a cloudflared quick tunnel (random *.trycloudflare.com name) reach the dev server for phone checks
    server: { allowedHosts: ['.trycloudflare.com'] },
  },
  integrations: [
    sitemap({
      // Keep the thank-you page and 404 out of the sitemap, as the hand-written one did
      filter: (p) => !/\/(thanks|404)\/?$/.test(p),
    }),
  ],
});
