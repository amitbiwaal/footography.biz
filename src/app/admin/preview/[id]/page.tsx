import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { PostArticle } from '@/components/site/PostArticle'
import { requireAdmin } from '@/lib/auth'
import { getMediaDimensions } from '@/lib/media'
import { adminGetPost, getRelatedPosts } from '@/lib/posts'

export const metadata: Metadata = { title: 'Preview', robots: { index: false, follow: false } }

export default async function PreviewPage({ params }: PageProps<'/admin/preview/[id]'>) {
  await requireAdmin()
  const id = Number((await params).id)
  const post = Number.isInteger(id) ? await adminGetPost(id) : null
  if (!post) notFound()

  const [related, size] = await Promise.all([
    getRelatedPosts(post),
    post.coverImage?.startsWith('/media/') ? getMediaDimensions(post.coverImage.slice(7)) : null,
  ])

  return (
    <>
      <div className="adm-preview-bar">
        <strong>Preview</strong> — this is how the post will look ({post.status}).{' '}
        <Link href={`/admin/posts/${post.id}`}>← Back to editor</Link>
      </div>
      <Header />
      <main id="main">
        <PostArticle post={post} related={related} coverSize={size} />
      </main>
      <Footer />
    </>
  )
}
