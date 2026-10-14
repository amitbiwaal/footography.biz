import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

const disallow = ['/admin', '/api/', '/go/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      // AI crawlers are welcome to read and cite public content
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'], allow: '/', disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
