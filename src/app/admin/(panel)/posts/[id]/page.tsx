import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin/PostEditor'
import { adminCategoryNames, adminGetPost } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = { title: 'Edit post' }

export default async function EditPostPage({ params, searchParams }: PageProps<'/admin/posts/[id]'>) {
  const id = Number((await params).id)
  const { created } = await searchParams
  if (!Number.isInteger(id) || id <= 0) notFound()
  const [post, categories] = await Promise.all([adminGetPost(id), adminCategoryNames()])
  if (!post) notFound()

  return (
    <>
      <div className="adm-page-head">
        <h1>Edit post</h1>
      </div>
      {/* key forces a fresh editor when switching between posts */}
      <PostEditor
        key={post.id}
        siteHost={new URL(SITE_URL).host}
        categories={categories}
        post={{ ...post, coverImage: post.coverImage ?? '' }}
        justCreated={Boolean(created)}
      />
    </>
  )
}
