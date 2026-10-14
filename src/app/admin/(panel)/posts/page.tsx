import type { Metadata } from 'next'
import Link from 'next/link'
import { ConfirmButton } from '@/components/admin/ConfirmButton'
import { adminListPosts } from '@/lib/posts'
import { formatDate } from '@/lib/text'
import { deletePostAction } from '../../actions'

export const metadata: Metadata = { title: 'All posts' }

export default async function PostsPage({ searchParams }: PageProps<'/admin/posts'>) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q.trim() : ''
  const status = typeof sp.status === 'string' ? sp.status : ''
  const posts = await adminListPosts({ q, status })
  const now = new Date().toISOString()

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>All posts</h1>
          <p className="adm-muted">{posts.length} post(s)</p>
        </div>
        <Link href="/admin/posts/new" className="adm-btn">
          ✎ Write new post
        </Link>
      </div>

      {sp.deleted && <p className="adm-alert adm-alert-success">Post deleted.</p>}

      <form className="adm-filters" role="search">
        <label htmlFor="q" className="sr-only">
          Search posts
        </label>
        <input id="q" name="q" type="search" defaultValue={q} placeholder="Search by title or slug…" />
        <label htmlFor="status" className="sr-only">
          Status
        </label>
        <select id="status" name="status" defaultValue={status}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <button className="adm-btn adm-btn-sm" type="submit">
          Filter
        </button>
      </form>

      {posts.length === 0 ? (
        <div className="adm-card adm-empty">
          <p>No posts found.</p>
          <Link href="/admin/posts/new" className="adm-btn">
            Write a post
          </Link>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Category</th>
                <th scope="col">Date</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const scheduled = p.status === 'published' && p.publishedAt && p.publishedAt > now
                return (
                  <tr key={p.id}>
                    <td data-label="Title">
                      <Link href={`/admin/posts/${p.id}`} className="adm-row-title">
                        {p.title}
                      </Link>
                      <div className="adm-muted adm-small">/blog/{p.slug}</div>
                    </td>
                    <td data-label="Status">
                      <span className={`adm-badge adm-badge-${scheduled ? 'scheduled' : p.status}`}>
                        {scheduled ? 'scheduled' : p.status}
                      </span>
                    </td>
                    <td data-label="Category">{p.category}</td>
                    <td data-label="Date">{formatDate(p.publishedAt ?? p.updatedAt)}</td>
                    <td className="adm-row-actions">
                      <Link href={`/admin/posts/${p.id}`}>Edit</Link>
                      {p.status === 'published' && !scheduled ? (
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noopener">
                          View
                        </a>
                      ) : (
                        <a href={`/admin/preview/${p.id}`} target="_blank" rel="noopener">
                          Preview
                        </a>
                      )}
                      <form action={deletePostAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton message={`Delete “${p.title}” permanently?`}>Delete</ConfirmButton>
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
