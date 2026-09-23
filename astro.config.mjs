import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './site.config';

export default defineConfig({
  site: siteConfig.site.url,
  output: 'static',
  trailingSlash: siteConfig.seo.trailingSlash,
  integrations: [sitemap()],
});
