import Image from 'next/image'
import Link from 'next/link'
import type { PostSummary } from '@/lib/posts'
import { formatDate } from '@/lib/text'

export function PostCard({ post, headingLevel = 'h3' }: { post: PostSummary; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <article className="post-card">
      <Link href={`/blog/${post.slug}`} className="post-card-media" tabIndex={-1} aria-hidden="true">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            fill
            sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 360px"
          />
        ) : (
          <span className="post-card-placeholder">{post.category}</span>
        )}
      </Link>
      <div className="post-card-body">
        <div className="post-meta">
          <Link href={`/blog/category/${post.categorySlug}`} className="chip">
            {post.category}
          </Link>
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
        </div>
        <Heading className="post-card-title">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </Heading>
        <p>{post.excerpt}</p>
      </div>
    </article>
  )
}
