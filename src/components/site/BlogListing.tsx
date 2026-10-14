import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { JsonLd } from './JsonLd'
import { PageHero } from './PageHero'
import { Pagination } from './Pagination'
import { PostCard } from './PostCard'
import { getCategories, getPublishedPosts } from '@/lib/posts'
import { breadcrumbLd, graph, pageMetadata, webPageLd } from '@/lib/seo'
import { absoluteUrl, site } from '@/lib/site'

export const POSTS_PER_PAGE = 9

const BLOG_TITLE = 'Footography Blog — Guides to Selling Feet Pics Online'
const BLOG_DESCRIPTION =
  'Step-by-step guides, privacy tips, pricing advice, and photo tutorials for creators who want to sell feet pics online safely with Footography.'

export function parsePage(raw: string | undefined) {
  if (raw === undefined) return 1
  if (!/^\d+$/.test(raw)) return null
  const n = Number(raw)
  return n >= 2 ? n : null
}

async function resolveCategory(categorySlug?: string) {
  if (!categorySlug) return null
  const categories = await getCategories()
  return categories.find((c) => c.slug === categorySlug) ?? null
}

export async function blogListingMetadata({ page, categorySlug }: { page: number; categorySlug?: string }): Promise<Metadata> {
  const category = await resolveCategory(categorySlug)
  const basePath = category ? `/blog/category/${category.slug}` : '/blog'
  const path = page > 1 ? `${basePath}/page/${page}` : basePath
  const pageSuffix = page > 1 ? ` — Page ${page}` : ''
  if (categorySlug && !category) return { title: 'Category Not Found', robots: { index: false } }

  return pageMetadata({
    title: category ? `${category.name} Articles${pageSuffix}` : `${BLOG_TITLE}${pageSuffix}`,
    absoluteTitle: !category,
    description: category
      ? `Read every ${category.name.toLowerCase()} article from the Footography.biz blog: practical advice for selling foot photography online safely.`
      : BLOG_DESCRIPTION,
    path,
  })
}

export async function BlogListing({ page, categorySlug }: { page: number; categorySlug?: string }) {
  const [category, categories] = await Promise.all([resolveCategory(categorySlug), getCategories()])
  if (categorySlug && !category) notFound()

  const { posts, total } = await getPublishedPosts({
    limit: POSTS_PER_PAGE,
    offset: (page - 1) * POSTS_PER_PAGE,
    categorySlug: category?.slug,
  })
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE))
  if (page > totalPages) notFound()

  const basePath = category ? `/blog/category/${category.slug}` : '/blog'
  const path = page > 1 ? `${basePath}/page/${page}` : basePath
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    ...(category ? [{ name: category.name, path: `/blog/category/${category.slug}` }] : []),
  ]
  const heading = category ? `${category.name} Articles` : 'The Footography Blog'
  const lead = category
    ? `All of our ${category.name.toLowerCase()} guides in one place.`
    : 'Practical, privacy-first guides for creators who want to sell feet pics online and earn safely.'

  const jsonLd = graph(
    {
      ...webPageLd({ path, title: heading, description: lead, type: 'CollectionPage' }),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((p, i) => ({
          '@type': 'ListItem',
          position: (page - 1) * POSTS_PER_PAGE + i + 1,
          url: absoluteUrl(`/blog/${p.slug}`),
          name: p.title,
        })),
      },
    },
    breadcrumbLd(crumbs),
  )

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={category ? 'Category' : `${site.brand} Guides`}
        title={page > 1 ? `${heading} — Page ${page}` : heading}
        lead={lead}
        crumbs={crumbs}
      />
      <section aria-label="Articles">
        <div className="wrap">
          {categories.length > 1 && (
            <nav aria-label="Blog categories">
              <ul className="chip-row">
                <li>
                  <Link className="chip" href="/blog" aria-current={!category ? 'page' : undefined}>
                    All Articles
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      className="chip"
                      href={`/blog/category/${c.slug}`}
                      aria-current={category?.slug === c.slug ? 'page' : undefined}
                    >
                      {c.name} ({c.count})
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {posts.length > 0 ? (
            <div className="post-grid">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} headingLevel="h2" />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>New guides are on the way</h2>
              <p>We are writing our first articles. In the meantime, read how Footography works on the homepage.</p>
              <Link className="btn" href="/#how-it-works">
                How Footography Works
              </Link>
            </div>
          )}

          <Pagination basePath={basePath} page={page} totalPages={totalPages} />
        </div>
      </section>
    </>
  )
}
