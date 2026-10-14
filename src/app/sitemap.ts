import type { MetadataRoute } from 'next'
import { getAllPublishedForIndex, getCategories } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

// Built on every request: on Vercel the cached sitemap is not refreshed by revalidatePath,
// so new posts would be missing for hours. Crawlers fetch it rarely and the query is small.
export const dynamic = 'force-dynamic'

const LEGAL_UPDATED = '2026-10-14'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPublishedForIndex(), getCategories()])
  const indexable = posts.filter((p) => !p.noindex && !p.canonicalUrl)
  const latest = indexable[0]?.updatedAt ?? LEGAL_UPDATED

  return [
    { url: absoluteUrl('/'), lastModified: latest, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/blog'), lastModified: latest, changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/about'), lastModified: LEGAL_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/contact'), lastModified: LEGAL_UPDATED, changeFrequency: 'yearly', priority: 0.5 },
    ...indexable.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      ...(p.coverImage ? { images: [absoluteUrl(p.coverImage)] } : {}),
    })),
    ...categories.map((c) => ({
      url: absoluteUrl(`/blog/category/${c.slug}`),
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    { url: absoluteUrl('/privacy-policy'), lastModified: LEGAL_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/terms'), lastModified: LEGAL_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/disclaimer'), lastModified: LEGAL_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
