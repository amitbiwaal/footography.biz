import { BlogListing, blogListingMetadata } from '@/components/site/BlogListing'

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps<'/blog/category/[category]'>) {
  return blogListingMetadata({ page: 1, categorySlug: (await params).category })
}

export default async function CategoryPage({ params }: PageProps<'/blog/category/[category]'>) {
  return <BlogListing page={1} categorySlug={(await params).category} />
}
