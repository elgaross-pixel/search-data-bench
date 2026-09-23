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
  editorial: { publisherName: 'Search Data Bench', methodologyUrl: null, affiliateDisclosureUrl: null },
  navigation: { primary: [], footer: [] },
  seo: { trailingSlash: 'always' as const, indexable: true, defaultOgImage: null },
  measurement: { provider: 'none' as const, analyticsId: null, trackAffiliateClicks: true },
  publication: { journalEnabled: true },
};
