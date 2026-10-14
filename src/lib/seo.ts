import type { Metadata } from 'next'
import { absoluteUrl, site } from './site'

type PageMetaInput = {
  title: string
  description: string
  path: string
  /** Use the title as-is instead of appending the site name */
  absoluteTitle?: boolean
  image?: { url: string; width?: number; height?: number; alt?: string } | null
  type?: 'website' | 'article'
  noindex?: boolean
  canonical?: string
  article?: { publishedTime?: string | null; modifiedTime?: string; section?: string; tags?: string[]; authors?: string[] }
}

/** Builds complete per-page metadata (canonical, Open Graph, Twitter, robots). */
export function pageMetadata(input: PageMetaInput): Metadata {
  const image = input.image ?? site.ogImage
  const images = [{ url: image.url, width: image.width, height: image.height, alt: image.alt || input.title }]
  const canonical = input.canonical || input.path
  const fullTitle = input.absoluteTitle ? input.title : `${input.title} | ${site.name}`

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    // `alternates` replaces the root layout value, so the RSS link is repeated here
    alternates: { canonical, types: { 'application/rss+xml': [{ url: '/feed.xml', title: `${site.name} Blog` }] } },
    robots: input.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: absoluteUrl(input.path),
      siteName: site.name,
      locale: site.locale,
      images,
      ...(input.type === 'article'
        ? {
            type: 'article',
            publishedTime: input.article?.publishedTime ?? undefined,
            modifiedTime: input.article?.modifiedTime,
            section: input.article?.section,
            tags: input.article?.tags,
            authors: input.article?.authors,
          }
        : { type: 'website' }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: input.description,
      images: images.map((i) => i.url),
    },
  }
}

/* --------------------------------- JSON-LD -------------------------------- */

export const organizationLd = {
  '@type': 'Organization',
  '@id': `${site.url}/#organization`,
  name: site.name,
  url: `${site.url}/`,
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl(site.logo.src),
    width: site.logo.width,
    height: site.logo.height,
  },
  description:
    'Footography.biz is an independent guide that explains how Footography works and how creators can sell foot photography online safely.',
}

export const websiteLd = {
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  name: site.name,
  url: `${site.url}/`,
  inLanguage: 'en',
  publisher: { '@id': `${site.url}/#organization` },
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function webPageLd({ path, title, description, type = 'WebPage' }: { path: string; title: string; description: string; type?: string }) {
  return {
    '@type': type,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': `${site.url}/#website` },
  }
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
