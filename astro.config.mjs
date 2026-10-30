// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://oahuwebco.com',
  // The live site's URLs end in a slash (/about/), so pages build as /about/index.html
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
    // Let a cloudflared quick tunnel (random *.trycloudflare.com name) reach the dev server for phone checks
    server: { allowedHosts: ['.trycloudflare.com'] },
  },
  // Pages prerender to static HTML; the Worker only serves assets until forms and staff pages land
  adapter: cloudflare({ imageService: 'compile' }),
  // No sessions yet: without this the adapter adds a SESSION KV binding that has no namespace to deploy to
  // @ts-expect-error `false` is accepted by the adapter though the config type omits it
  session: false,
  integrations: [
    sitemap({
      // Keep the thank-you page and 404 out of the sitemap, as the hand-written one did
      filter: (p) => !/\/(thanks|404)\/?$/.test(p),
    }),
  ],
});
