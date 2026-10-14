import type { Metadata } from 'next'
import Link from 'next/link'
import { adminListPosts, adminStats } from '@/lib/posts'
import { formatDate } from '@/lib/text'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const [stats, posts] = await Promise.all([adminStats(), adminListPosts()])
  const recent = posts.slice(0, 6)

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="adm-muted">Welcome back. Here is what is happening on your site.</p>
        </div>
        <Link href="/admin/posts/new" className="adm-btn">
          ✎ Write new post
        </Link>
      </div>

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-num">{stats.published}</span>
          <span>Published posts</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-num">{stats.drafts}</span>
          <span>Drafts</span>
        </div>
        <div className="adm-stat">
          <span className="adm-stat-num">{stats.media}</span>
          <span>Images</span>
        </div>
        <Link href="/admin/messages" className="adm-stat">
          <span className="adm-stat-num">{stats.unread}</span>
          <span>Unread messages</span>
        </Link>
      </div>

      <div className="adm-dash-grid">
        <section className="adm-card">
          <h2 className="adm-card-title">Recent posts</h2>
          {recent.length === 0 ? (
            <p className="adm-muted">
              No posts yet. <Link href="/admin/posts/new">Write your first post</Link>.
            </p>
          ) : (
            <ul className="adm-list">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/posts/${p.id}`}>{p.title}</Link>
                  <span className="adm-muted">
                    <span className={`adm-badge adm-badge-${p.status}`}>{p.status}</span>{' '}
                    {formatDate(p.publishedAt ?? p.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <h2 className="adm-card-title">SEO tools</h2>
          <ul className="adm-list">
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noopener">
                XML sitemap ↗
              </a>
              <span className="adm-muted">Submit to Google Search Console</span>
            </li>
            <li>
              <a href="/robots.txt" target="_blank" rel="noopener">
                robots.txt ↗
              </a>
              <span className="adm-muted">Crawler rules</span>
            </li>
            <li>
              <a href="/feed.xml" target="_blank" rel="noopener">
                RSS feed ↗
              </a>
              <span className="adm-muted">Latest 30 posts</span>
            </li>
            <li>
              <a href="/llms.txt" target="_blank" rel="noopener">
                llms.txt ↗
              </a>
              <span className="adm-muted">Summary for AI search engines</span>
            </li>
          </ul>
          <h3 className="adm-subtitle">Writing checklist</h3>
          <ul className="adm-tips">
            <li>One clear focus keyword per post, used in the title, slug, and first paragraph.</li>
            <li>800+ words, broken up with H2 and H3 headings.</li>
            <li>At least two internal links to related posts or pages.</li>
            <li>A featured image with descriptive alt text.</li>
          </ul>
        </section>
      </div>
    </>
  )
}
