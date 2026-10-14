import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/site/JsonLd'
import { PostArticle } from '@/components/site/PostArticle'
import { getMediaDimensions } from '@/lib/media'
import { getAllPublishedForIndex, getPublishedPostBySlug, getRelatedPosts } from '@/lib/posts'
import { breadcrumbLd, graph, organizationLd, pageMetadata } from '@/lib/seo'
import { absoluteUrl, site } from '@/lib/site'
import { parseTags, wordCount } from '@/lib/text'

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await getAllPublishedForIndex()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const post = await getPublishedPostBySlug((await params).slug)
  if (!post) return { title: 'Article Not Found', robots: { index: false } }
  const size = await getMediaDimensions(post.coverImage)

  return pageMetadata({
    title: post.metaTitle || post.title,
    absoluteTitle: Boolean(post.metaTitle),
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    canonical: post.canonicalUrl || undefined,
    noindex: post.noindex,
    type: 'article',
    image: post.coverImage
      ? { url: post.coverImage, width: size?.width, height: size?.height, alt: post.coverAlt || post.title }
      : null,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.category,
      tags: parseTags(post.tags),
      authors: [post.author],
    },
  })
}

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const post = await getPublishedPostBySlug((await params).slug)
  if (!post) notFound()

  const [related, size] = await Promise.all([getRelatedPosts(post), getMediaDimensions(post.coverImage)])
  const url = absoluteUrl(`/blog/${post.slug}`)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.category, path: `/blog/category/${post.categorySlug}` },
    { name: post.title, path: `/blog/${post.slug}` },
  ]

  const jsonLd = graph(
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      headline: post.title.slice(0, 110),
      description: post.metaDescription || post.excerpt,
      image: post.coverImage ? [absoluteUrl(post.coverImage)] : [absoluteUrl(site.ogImage.url)],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { '@type': 'Organization', name: post.author, url: absoluteUrl('/about') },
      publisher: { '@id': organizationLd['@id'] },
      articleSection: post.category,
      keywords: parseTags(post.tags).join(', ') || undefined,
      wordCount: wordCount(post.content),
      inLanguage: 'en',
    },
    organizationLd,
    breadcrumbLd(crumbs),
  )

  return (
    <>
      <JsonLd data={jsonLd} />
      <PostArticle post={post} related={related} coverSize={size} />
    </>
  )
}
