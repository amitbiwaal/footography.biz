import Image from 'next/image'
import Link from 'next/link'
import { Breadcrumbs } from './Breadcrumbs'
import { PostCard } from './PostCard'
import type { Post, PostSummary } from '@/lib/posts'
import { withHeadingIds } from '@/lib/sanitize'
import { AFFILIATE_URL } from '@/lib/site'
import { formatDate, parseTags, readingTime } from '@/lib/text'

export function PostArticle({
  post,
  related,
  coverSize,
}: {
  post: Post
  related: PostSummary[]
  coverSize: { width: number; height: number } | null
}) {
  const { html, toc } = withHeadingIds(post.content)
  const tags = parseTags(post.tags)
  const minutes = readingTime(post.content)
  const showToc = toc.length >= 3
  const updated = post.publishedAt && post.updatedAt.slice(0, 10) > post.publishedAt.slice(0, 10)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.category, path: `/blog/category/${post.categorySlug}` },
    { name: post.title, path: `/blog/${post.slug}` },
  ]

  return (
    <article>
      <header className="article-header">
        <div className="wrap">
          <Breadcrumbs items={crumbs} />
          <h1>{post.title}</h1>
          {post.excerpt && <p className="lead">{post.excerpt}</p>}
          <div className="post-meta">
            <Link href={`/blog/category/${post.categorySlug}`} className="chip">
              {post.category}
            </Link>
            <span>By {post.author}</span>
            {post.publishedAt && (
              <span>
                Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </span>
            )}
            {updated && (
              <span>
                Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
              </span>
            )}
            <span>{minutes} min read</span>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="article-cover">
          <Image
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            width={coverSize?.width ?? 1600}
            height={coverSize?.height ?? 900}
            sizes="(max-width: 1000px) 100vw, 960px"
            preload
          />
        </div>
      )}

      <div className={`article-layout${showToc ? '' : ' no-toc'}`}>
        {showToc && (
          <nav className="toc" aria-labelledby="toc-h">
            <h2 id="toc-h">On this page</h2>
            <ol>
              {toc.map((item) => (
                <li key={item.id} className={`lvl-${item.level}`}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          <aside className="inline-cta" aria-labelledby="post-cta-h">
            <h2 id="post-cta-h">Ready to Start Selling on Footography?</h2>
            <p>Open a free account, keep your identity private, and set your own prices from day one.</p>
            <a className="btn" href={AFFILIATE_URL} rel="nofollow sponsored noopener" target="_blank">
              Visit Footography
            </a>
          </aside>

          <footer className="article-footer">
            {tags.length > 0 && (
              <ul className="tag-list" aria-label="Tags">
                {tags.map((t) => (
                  <li key={t}>#{t}</li>
                ))}
              </ul>
            )}
            <div className="author-box">
              <div className="author-avatar" aria-hidden="true">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{post.author}</strong>
                <p>
                  We write practical, privacy-first guides for people selling foot photography online.{' '}
                  <Link href="/about">About us</Link>.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {related.length > 0 && (
        <section className="alt" aria-labelledby="related-h">
          <div className="wrap">
            <h2 id="related-h">Related Articles</h2>
            <div className="post-grid">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
