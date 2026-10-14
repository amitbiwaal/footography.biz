import type { Metadata } from 'next'
import { PostEditor } from '@/components/admin/PostEditor'
import { adminCategoryNames } from '@/lib/posts'
import { SITE_URL, site } from '@/lib/site'

export const metadata: Metadata = { title: 'New post' }

export default async function NewPostPage() {
  const categories = await adminCategoryNames()
  return (
    <>
      <div className="adm-page-head">
        <h1>Write new post</h1>
      </div>
      <PostEditor
        siteHost={new URL(SITE_URL).host}
        categories={categories}
        post={{
          id: null,
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          coverImage: '',
          coverAlt: '',
          category: 'Guides',
          tags: '',
          metaTitle: '',
          metaDescription: '',
          focusKeyword: '',
          canonicalUrl: '',
          noindex: false,
          status: 'draft',
          author: site.defaultAuthor,
          publishedAt: null,
        }}
      />
    </>
  )
}
