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
    build: {
      // Never inline component scripts: the Content-Security-Policy allows scripts from 'self' only,
      // so an inlined one (the phone menu, the form, Lenis) would be blocked on the live site
      assetsInlineLimit: (file) => (file.endsWith('.js') ? false : undefined),
    },
  },
  integrations: [
    sitemap({
      // Keep the thank-you page and 404 out of the sitemap, as the hand-written one did
      filter: (p) => !/\/(thanks|404)\/?$/.test(p),
    }),
  ],
});
