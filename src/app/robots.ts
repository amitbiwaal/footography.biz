import type { MetadataRoute } from 'next'
import { NOINDEX, SITE_URL } from '@/lib/site'

const disallow = ['/admin', '/api/', '/go/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      // AI crawlers are welcome to read and cite public content
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'], allow: '/', disallow },
    ],
    // In noindex mode crawling stays allowed so search engines can see the noindex tags,
    // but the sitemap is not advertised
    ...(NOINDEX ? {} : { sitemap: `${SITE_URL}/sitemap.xml` }),
  }
}
