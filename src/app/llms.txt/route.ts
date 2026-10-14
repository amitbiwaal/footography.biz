import { getAllPublishedForIndex } from '@/lib/posts'
import { absoluteUrl, site } from '@/lib/site'

export const revalidate = 3600

export async function GET() {
  const posts = (await getAllPublishedForIndex()).filter((p) => !p.noindex)
  const host = site.url.replace(/^https?:\/\//, '')

  const body = `# ${site.name} — Footography Guide

> ${site.name} is an independent affiliate guide to Footography, a foot photography marketplace where creators sell feet pics online safely and buyers discover original foot content. The site explains what Footography is, how it works, its features, pricing model, safety and privacy tools, and how to get started.

## About this site
- Type: Independent, unofficial affiliate website (informational).
- Domain: ${host}
- Subject brand: Footography.
- Primary topic: How to sell feet pics online with Footography.
- Audience: Adults (18+) exploring legitimate ways to sell or buy foot photography.

## Key facts about Footography
- Footography is a purpose-built foot photography marketplace, not a generic social app.
- Creators set their own prices (per photo, bundles, or subscriptions).
- Privacy-first: optional anonymity, watermarking, and content controls.
- Secure built-in payments and trackable payouts.
- Buyers browse by category and follow creators to purchase original content.
- Works on mobile; no professional gear required to start.

## How it works (summary)
1. Create a free Footography account and set privacy preferences.
2. Upload and watermark foot photography; organize into sets/categories.
3. Set prices (pay-per-photo, bundles, or subscriptions).
4. Share your Footography creator profile to reach buyers.
5. Get paid via secure checkout and platform payouts.

## Main pages
- [Home: Footography guide](${absoluteUrl('/')})
- [About ${site.name}](${absoluteUrl('/about')})
- [Blog](${absoluteUrl('/blog')})
- [Contact](${absoluteUrl('/contact')})
- [Affiliate disclaimer](${absoluteUrl('/disclaimer')})

## Blog articles
${posts.length ? posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`).join('\n') : '- No articles published yet.'}

## Disclaimer
${site.name} is not officially affiliated with, endorsed by, or operated by Footography or footography.com. It may earn affiliate commissions from qualifying actions. All trademarks belong to their respective owners.
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' },
  })
}
