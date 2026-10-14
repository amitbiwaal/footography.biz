import 'server-only'
import { cache } from 'react'
import type { Row } from '@libsql/client'
import { db, nowIso } from './db'

export type PostStatus = 'draft' | 'published'

export type Post = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string | null
  coverAlt: string
  category: string
  categorySlug: string
  tags: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  canonicalUrl: string
  noindex: boolean
  status: PostStatus
  author: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type PostSummary = Omit<Post, 'content'>

export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>

const SUMMARY_COLUMNS = `id, slug, title, excerpt, cover_image, cover_alt, category, category_slug, tags, meta_title,
  meta_description, focus_keyword, canonical_url, noindex, status, author, published_at, created_at, updated_at`

function toPost(row: Row): Post {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ''),
    content: String(row.content ?? ''),
    coverImage: row.cover_image ? String(row.cover_image) : null,
    coverAlt: String(row.cover_alt ?? ''),
    category: String(row.category ?? ''),
    categorySlug: String(row.category_slug ?? ''),
    tags: String(row.tags ?? ''),
    metaTitle: String(row.meta_title ?? ''),
    metaDescription: String(row.meta_description ?? ''),
    focusKeyword: String(row.focus_keyword ?? ''),
    canonicalUrl: String(row.canonical_url ?? ''),
    noindex: Number(row.noindex) === 1,
    status: row.status === 'published' ? 'published' : 'draft',
    author: String(row.author ?? ''),
    publishedAt: row.published_at ? String(row.published_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

const LIVE = `status = 'published' AND published_at IS NOT NULL AND published_at <= ?`

/* ----------------------------- Public queries ----------------------------- */

export async function getPublishedPosts({ limit = 9, offset = 0, categorySlug }: { limit?: number; offset?: number; categorySlug?: string } = {}) {
  const client = await db()
  const where = categorySlug ? `${LIVE} AND category_slug = ?` : LIVE
  const args = categorySlug ? [nowIso(), categorySlug] : [nowIso()]
  const [rows, count] = await Promise.all([
    client.execute({
      sql: `SELECT ${SUMMARY_COLUMNS} FROM posts WHERE ${where} ORDER BY published_at DESC LIMIT ? OFFSET ?`,
      args: [...args, limit, offset],
    }),
    client.execute({ sql: `SELECT COUNT(*) AS n FROM posts WHERE ${where}`, args }),
  ])
  return { posts: rows.rows.map(toPost) as PostSummary[], total: Number(count.rows[0].n) }
}

export const getPublishedPostBySlug = cache(async (slug: string) => {
  const client = await db()
  const res = await client.execute({ sql: `SELECT * FROM posts WHERE slug = ? AND ${LIVE}`, args: [slug, nowIso()] })
  return res.rows[0] ? toPost(res.rows[0]) : null
})

export async function getAllPublishedForIndex() {
  const client = await db()
  const res = await client.execute({
    sql: `SELECT ${SUMMARY_COLUMNS} FROM posts WHERE ${LIVE} ORDER BY published_at DESC`,
    args: [nowIso()],
  })
  return res.rows.map(toPost) as PostSummary[]
}

export async function getRelatedPosts(post: Pick<Post, 'id' | 'categorySlug'>, limit = 3) {
  const client = await db()
  const res = await client.execute({
    sql: `SELECT ${SUMMARY_COLUMNS} FROM posts WHERE ${LIVE} AND id != ?
          ORDER BY (category_slug = ?) DESC, published_at DESC LIMIT ?`,
    args: [nowIso(), post.id, post.categorySlug, limit],
  })
  return res.rows.map(toPost) as PostSummary[]
}

export async function getCategories() {
  const client = await db()
  const res = await client.execute({
    sql: `SELECT category, category_slug, COUNT(*) AS n, MAX(updated_at) AS updated FROM posts
          WHERE ${LIVE} GROUP BY category_slug ORDER BY n DESC, category ASC`,
    args: [nowIso()],
  })
  return res.rows.map((r) => ({
    name: String(r.category),
    slug: String(r.category_slug),
    count: Number(r.n),
    updatedAt: String(r.updated),
  }))
}

/* ------------------------------ Admin queries ----------------------------- */

export async function adminListPosts({ q, status }: { q?: string; status?: string } = {}) {
  const client = await db()
  const where: string[] = []
  const args: (string | number)[] = []
  if (q) {
    where.push('(title LIKE ? OR slug LIKE ?)')
    args.push(`%${q}%`, `%${q}%`)
  }
  if (status === 'draft' || status === 'published') {
    where.push('status = ?')
    args.push(status)
  }
  const res = await client.execute({
    sql: `SELECT ${SUMMARY_COLUMNS} FROM posts ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
          ORDER BY COALESCE(published_at, updated_at) DESC`,
    args,
  })
  return res.rows.map(toPost) as PostSummary[]
}

export async function adminGetPost(id: number) {
  const client = await db()
  const res = await client.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [id] })
  return res.rows[0] ? toPost(res.rows[0]) : null
}

export async function adminStats() {
  const client = await db()
  const res = await client.execute(`SELECT
      (SELECT COUNT(*) FROM posts) AS total,
      (SELECT COUNT(*) FROM posts WHERE status = 'published') AS published,
      (SELECT COUNT(*) FROM posts WHERE status = 'draft') AS drafts,
      (SELECT COUNT(*) FROM media) AS media,
      (SELECT COUNT(*) FROM messages WHERE is_read = 0) AS unread`)
  const r = res.rows[0]
  return {
    total: Number(r.total),
    published: Number(r.published),
    drafts: Number(r.drafts),
    media: Number(r.media),
    unread: Number(r.unread),
  }
}

export async function adminCategoryNames() {
  const client = await db()
  const res = await client.execute('SELECT DISTINCT category FROM posts ORDER BY category')
  return res.rows.map((r) => String(r.category))
}

export async function slugTaken(slug: string, exceptId?: number) {
  const client = await db()
  const res = await client.execute({
    sql: 'SELECT id FROM posts WHERE slug = ? AND id != ?',
    args: [slug, exceptId ?? -1],
  })
  return res.rows.length > 0
}

export async function createPost(input: PostInput) {
  const client = await db()
  const now = nowIso()
  const res = await client.execute({
    sql: `INSERT INTO posts (slug, title, excerpt, content, cover_image, cover_alt, category, category_slug, tags, meta_title,
            meta_description, focus_keyword, canonical_url, noindex, status, author, published_at, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.slug, input.title, input.excerpt, input.content, input.coverImage, input.coverAlt, input.category,
      input.categorySlug, input.tags, input.metaTitle, input.metaDescription, input.focusKeyword, input.canonicalUrl,
      input.noindex ? 1 : 0, input.status, input.author, input.publishedAt, now, now,
    ],
  })
  return Number(res.lastInsertRowid)
}

export async function updatePost(id: number, input: PostInput) {
  const client = await db()
  await client.execute({
    sql: `UPDATE posts SET slug = ?, title = ?, excerpt = ?, content = ?, cover_image = ?, cover_alt = ?, category = ?,
            category_slug = ?, tags = ?, meta_title = ?, meta_description = ?, focus_keyword = ?, canonical_url = ?,
            noindex = ?, status = ?, author = ?, published_at = ?, updated_at = ?
          WHERE id = ?`,
    args: [
      input.slug, input.title, input.excerpt, input.content, input.coverImage, input.coverAlt, input.category,
      input.categorySlug, input.tags, input.metaTitle, input.metaDescription, input.focusKeyword, input.canonicalUrl,
      input.noindex ? 1 : 0, input.status, input.author, input.publishedAt, nowIso(), id,
    ],
  })
}

export async function deletePost(id: number) {
  const client = await db()
  await client.execute({ sql: 'DELETE FROM posts WHERE id = ?', args: [id] })
}
