import { BlogListing, blogListingMetadata } from '@/components/site/BlogListing'

export const revalidate = 3600

export function generateMetadata() {
  return blogListingMetadata({ page: 1 })
}

export default function BlogPage() {
  return <BlogListing page={1} />
}
