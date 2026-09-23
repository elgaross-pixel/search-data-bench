import { siteConfig } from '../../site.config';

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.site.name,
    url: siteConfig.site.url,
    description: siteConfig.site.description,
  };
}
