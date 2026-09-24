export const siteConfig = {
  asset: { id: 'WF-A002', status: 'production' as const },
  site: {
    name: 'Search Data Bench',
    domain: 'searchdatabench.com',
    url: 'https://searchdatabench.com',
    language: 'en',
    locale: 'en-US',
    tagline: 'Independent benchmarks for Search, SEO & AI data APIs.',
    description: 'Independent benchmarks and buyer research for Search Data, SEO APIs and AI Search APIs.',
  },
  brand: { logoText: 'SDB', favicon: '/favicon.svg', themeColor: '#20252b' },
  editorial: {
    publisherName: 'Search Data Bench',
    methodologyUrl: '/methodology/',
    affiliateDisclosureUrl: '/affiliate-disclosure/',
  },
  navigation: {
    primary: [
      { label: 'Research', href: '/research/' },
      { label: 'Reviews', href: '/reviews/' },
      { label: 'Benchmarks', href: '/benchmarks/' },
      { label: 'Methodology', href: '/methodology/' },
    ],
    footer: [
      { label: 'About', href: '/about/' },
      { label: 'Methodology', href: '/methodology/' },
      { label: 'Affiliate disclosure', href: '/affiliate-disclosure/' },
    ],
  },
  seo: { trailingSlash: 'always' as const, indexable: true, defaultOgImage: null },
  measurement: { provider: 'none' as const, analyticsId: null, trackAffiliateClicks: true },
  publication: { journalEnabled: true },
};
