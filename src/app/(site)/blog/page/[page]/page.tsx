import { notFound } from 'next/navigation'
import { BlogListing, blogListingMetadata, parsePage } from '@/components/site/BlogListing'

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps<'/blog/page/[page]'>) {
  const page = parsePage((await params).page)
  return page ? blogListingMetadata({ page }) : {}
}

export default async function BlogPagedPage({ params }: PageProps<'/blog/page/[page]'>) {
  const page = parsePage((await params).page)
  if (!page) notFound()
  return <BlogListing page={page} />
}
