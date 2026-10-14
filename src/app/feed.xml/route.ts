import { getPublishedPosts } from '@/lib/posts'
import { absoluteUrl, site } from '@/lib/site'

export const revalidate = 3600

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function GET() {
  const { posts } = await getPublishedPosts({ limit: 30 })
  const items = posts
    .filter((p) => !p.noindex)
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`)
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.excerpt)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${new Date(p.publishedAt!).toUTCString()}</pubDate>${
        p.coverImage ? `\n      <enclosure url="${esc(absoluteUrl(p.coverImage))}" type="image/webp" length="0" />` : ''
      }
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${esc('Guides to selling feet pics online safely with Footography.')}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date(posts[0]?.updatedAt ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' },
  })
}
