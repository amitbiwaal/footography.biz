import { notFound } from 'next/navigation'
import { BlogListing, blogListingMetadata, parsePage } from '@/components/site/BlogListing'

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps<'/blog/category/[category]/page/[page]'>) {
  const { category, page: raw } = await params
  const page = parsePage(raw)
  return page ? blogListingMetadata({ page, categorySlug: category }) : {}
}

export default async function CategoryPagedPage({ params }: PageProps<'/blog/category/[category]/page/[page]'>) {
  const { category, page: raw } = await params
  const page = parsePage(raw)
  if (!page) notFound()
  return <BlogListing page={page} categorySlug={category} />
}
