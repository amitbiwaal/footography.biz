import { getMediaFile } from '@/lib/media'

export async function GET(_req: Request, ctx: RouteContext<'/media/[file]'>) {
  const { file } = await ctx.params
  if (!/^[a-z0-9-]+\.(webp|png|jpe?g|gif|avif)$/i.test(file)) {
    return new Response('Not found', { status: 404 })
  }
  const media = await getMediaFile(file)
  if (!media) return new Response('Not found', { status: 404 })

  return new Response(media.data, {
    headers: {
      'Content-Type': media.mime,
      'Content-Length': String(media.data.byteLength),
      // File names include a unique suffix, so the content never changes
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
