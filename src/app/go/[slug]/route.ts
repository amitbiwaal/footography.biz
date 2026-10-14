import { outboundLinks } from '@/lib/site'

// Outbound partner redirect: /go/footography → partner URL.
// Keeps affiliate URLs in one place (src/lib/site.ts) and out of search indexes.
export async function GET(_req: Request, ctx: RouteContext<'/go/[slug]'>) {
  const { slug } = await ctx.params
  const target = outboundLinks[slug]
  if (!target) return new Response('Not found', { status: 404 })
  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
  })
}
