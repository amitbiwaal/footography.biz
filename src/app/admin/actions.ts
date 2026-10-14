'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { checkCredentials, clientIp, endSession, rateLimit, requireAdmin, resetRateLimit, startSession, adminConfigured } from '@/lib/auth'
import { deleteMedia } from '@/lib/media'
import { deleteMessage, setMessageRead } from '@/lib/messages'
import { createPost, deletePost, slugTaken, updatePost, type PostInput } from '@/lib/posts'
import { sanitizePostHtml } from '@/lib/sanitize'
import { site } from '@/lib/site'
import { slugify, stripHtml, truncate } from '@/lib/text'

/* ---------------------------------- Auth ---------------------------------- */

// `email` is sent back so the field is not cleared when React resets the form after a failed attempt
export type LoginState = { error: string; email?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').slice(0, 200)
  const password = String(formData.get('password') ?? '')
  if (!adminConfigured()) {
    return { email, error: 'Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET in .env.local.' }
  }
  const ip = await clientIp()
  const key = `login:${ip}`
  if (!rateLimit(key, 5, 15 * 60 * 1000)) {
    return { email, error: 'Too many failed attempts. Please wait 15 minutes and try again.' }
  }
  if (!checkCredentials(email, password)) {
    return { email, error: 'Incorrect email or password.' }
  }
  resetRateLimit(key)
  await startSession(email.trim().toLowerCase())

  const next = String(formData.get('next') ?? '')
  // Only allow redirects back into the admin area (prevents open redirects)
  redirect(next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin')
}

export async function logoutAction() {
  await endSession()
  redirect('/admin/login')
}

/* ---------------------------------- Posts --------------------------------- */

export type SavePostState = {
  ok: boolean
  error?: string
  message?: string
  savedAt?: string
  status?: 'draft' | 'published'
  slug?: string
}

/** Refresh every cached public page after a post changes. */
function refreshPublicPages() {
  // Home, blog lists, categories and post pages
  revalidatePath('/', 'layout')
  // Route handlers are not part of the layout tree; refresh them explicitly.
  // (sitemap.xml is rendered per request, see src/app/sitemap.ts)
  for (const path of ['/feed.xml', '/llms.txt']) revalidatePath(path)
}

const RESERVED_SLUGS = new Set(['page', 'category', 'feed', 'rss', 'admin', 'new'])

function str(formData: FormData, key: string, max = 500) {
  return String(formData.get(key) ?? '').trim().slice(0, max)
}

function isValidUrl(value: string, { allowRelative }: { allowRelative: boolean }) {
  if (allowRelative && value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export async function savePostAction(_prev: SavePostState, formData: FormData): Promise<SavePostState> {
  await requireAdmin()

  const id = Number(formData.get('id')) || null
  const intent = str(formData, 'intent', 20)
  const title = str(formData, 'title', 200)
  if (!title) return { ok: false, error: 'Please add a title.' }

  const slug = slugify(str(formData, 'slug', 200) || title)
  if (!slug) return { ok: false, error: 'The URL slug must contain letters or numbers.' }
  if (RESERVED_SLUGS.has(slug)) return { ok: false, error: `“${slug}” is reserved. Please choose another slug.` }
  if (await slugTaken(slug, id ?? undefined)) {
    return { ok: false, error: `Another post already uses the URL /blog/${slug}. Please change the slug.` }
  }

  const content = sanitizePostHtml(String(formData.get('content') ?? ''))
  const status = intent === 'publish' ? 'published' : 'draft'
  if (status === 'published' && stripHtml(content).length < 50) {
    return { ok: false, error: 'The post content is too short to publish.' }
  }

  const coverImage = str(formData, 'coverImage', 500)
  if (coverImage && !isValidUrl(coverImage, { allowRelative: true })) {
    return { ok: false, error: 'The cover image URL is not valid.' }
  }
  const canonicalUrl = str(formData, 'canonicalUrl', 500)
  if (canonicalUrl && !isValidUrl(canonicalUrl, { allowRelative: false })) {
    return { ok: false, error: 'The canonical URL must be a full URL starting with https://' }
  }

  let publishedAt = str(formData, 'publishedAt', 40) || null
  if (publishedAt && Number.isNaN(Date.parse(publishedAt))) publishedAt = null
  if (publishedAt) publishedAt = new Date(publishedAt).toISOString()
  if (status === 'published' && !publishedAt) publishedAt = new Date().toISOString()

  const category = str(formData, 'category', 60) || 'Guides'
  const tags = str(formData, 'tags', 400)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t, i, all) => all.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i)
    .slice(0, 15)
    .join(', ')

  const input: PostInput = {
    slug,
    title,
    excerpt: str(formData, 'excerpt', 400) || truncate(stripHtml(content), 160),
    content,
    coverImage: coverImage || null,
    coverAlt: str(formData, 'coverAlt', 200),
    category,
    categorySlug: slugify(category) || 'guides',
    tags,
    metaTitle: str(formData, 'metaTitle', 120),
    metaDescription: str(formData, 'metaDescription', 320),
    focusKeyword: str(formData, 'focusKeyword', 100),
    canonicalUrl,
    noindex: formData.get('noindex') === 'on',
    status,
    author: str(formData, 'author', 100) || site.defaultAuthor,
    publishedAt,
  }

  let postId = id
  if (postId) {
    await updatePost(postId, input)
  } else {
    postId = await createPost(input)
  }

  refreshPublicPages()

  if (!id) redirect(`/admin/posts/${postId}?created=1`)

  return {
    ok: true,
    message: status === 'published' ? 'Post published and live on the site.' : 'Draft saved.',
    savedAt: new Date().toISOString(),
    status,
    slug,
  }
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (id) {
    await deletePost(id)
    refreshPublicPages()
  }
  redirect('/admin/posts?deleted=1')
}

/* ---------------------------------- Media --------------------------------- */

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (id) await deleteMedia(id)
  revalidatePath('/admin/media')
}

/* -------------------------------- Messages -------------------------------- */

export async function toggleMessageAction(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (id) await setMessageRead(id, formData.get('read') === '1')
  revalidatePath('/admin', 'layout')
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (id) await deleteMessage(id)
  revalidatePath('/admin', 'layout')
}
