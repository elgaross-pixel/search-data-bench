import type { APIRoute } from 'astro';
import { siteConfig } from '../../site.config';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site);
  const rules = siteConfig.seo.indexable ? 'Allow: /' : 'Disallow: /';
  return new Response(`User-agent: *\n${rules}\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
