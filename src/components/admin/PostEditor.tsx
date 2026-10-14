'use client'

import Link from 'next/link'
import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { deletePostAction, savePostAction, type SavePostState } from '@/app/admin/actions'
import { MediaPicker } from './MediaPicker'
import { RichTextEditor } from './RichTextEditor'
import { SeoPanel, analyse } from './SeoPanel'

export type EditablePost = {
  id: number | null
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  coverAlt: string
  category: string
  tags: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  canonicalUrl: string
  noindex: boolean
  status: 'draft' | 'published'
  author: string
  publishedAt: string | null
}

const DEFAULT_CATEGORIES = ['Guides', 'Privacy & Safety', 'Photography Tips', 'Pricing & Earnings', 'Platform Reviews']

function slugify(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function isoToLocalInput(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function Counter({ value, min, max }: { value: string; min: number; max: number }) {
  const n = value.length
  const cls = n === 0 ? '' : n < min || n > max ? 'is-warn' : 'is-ok'
  return (
    <span className={`adm-counter ${cls}`}>
      {n} / {max}
    </span>
  )
}

export function PostEditor({
  post,
  categories,
  siteHost,
  justCreated = false,
}: {
  post: EditablePost
  categories: string[]
  siteHost: string
  justCreated?: boolean
}) {
  // A brand-new post redirects here after its first save, so start with that save's confirmation
  const [state, formAction, pending] = useActionState<SavePostState, FormData>(
    savePostAction,
    justCreated
      ? {
          ok: true,
          message: post.status === 'published' ? 'Post published and live on the site.' : 'Draft created.',
          status: post.status,
          slug: post.slug,
        }
      : { ok: false },
  )

  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [slugTouched, setSlugTouched] = useState(Boolean(post.id))
  const [content, setContent] = useState(post.content)
  const [excerpt, setExcerpt] = useState(post.excerpt)
  const [coverImage, setCoverImage] = useState(post.coverImage)
  const [coverAlt, setCoverAlt] = useState(post.coverAlt)
  const [category, setCategory] = useState(post.category)
  const [tags, setTags] = useState(post.tags)
  const [metaTitle, setMetaTitle] = useState(post.metaTitle)
  const [metaDescription, setMetaDescription] = useState(post.metaDescription)
  const [focusKeyword, setFocusKeyword] = useState(post.focusKeyword)
  const [canonicalUrl, setCanonicalUrl] = useState(post.canonicalUrl)
  const [noindex, setNoindex] = useState(post.noindex)
  const [author, setAuthor] = useState(post.author)
  const [publishedLocal, setPublishedLocal] = useState('')
  const [showCoverPicker, setShowCoverPicker] = useState(false)
  const [dirty, setDirty] = useState(false)

  const status = state.status ?? post.status
  const liveSlug = state.slug ?? post.slug
  const formRef = useRef<HTMLFormElement>(null)
  const saveBtnRef = useRef<HTMLButtonElement>(null)

  // Local time only exists in the browser, so fill the date field after mount
  useEffect(() => setPublishedLocal(isoToLocalInput(post.publishedAt)), [post.publishedAt])

  // Drop ?created=1 so a page reload does not repeat the confirmation
  useEffect(() => {
    if (justCreated) window.history.replaceState(null, '', window.location.pathname)
  }, [justCreated])

  useEffect(() => {
    if (state.ok) setDirty(false)
  }, [state])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        formRef.current?.requestSubmit(saveBtnRef.current ?? undefined)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const touch = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setDirty(true)
  }

  const onTitle = (v: string) => {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
    setDirty(true)
  }

  const allCategories = useMemo(() => [...new Set([...DEFAULT_CATEGORIES, ...categories])].sort(), [categories])
  const { words } = analyse({ title, metaTitle, metaDescription, slug, content, keyword: focusKeyword, coverImage, excerpt })
  const publishedIso = publishedLocal ? new Date(publishedLocal).toISOString() : ''
  const scheduled = status === 'published' && publishedIso && new Date(publishedIso) > new Date()

  return (
    <form ref={formRef} action={formAction} className="adm-editor" onChange={() => setDirty(true)}>
      <input type="hidden" name="id" value={post.id ?? ''} />
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="publishedAt" value={publishedIso} />
      <input type="hidden" name="coverImage" value={coverImage} />

      <div className="adm-editor-main">
        <div aria-live="polite">
          {state.error && <p className="adm-alert adm-alert-error">{state.error}</p>}
          {state.ok && state.message && (
            <p className="adm-alert adm-alert-success">
              {state.message}{' '}
              {status === 'published' && (
                <Link href={`/blog/${liveSlug}`} target="_blank">
                  View post ↗
                </Link>
              )}
            </p>
          )}
        </div>

        <div className="adm-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            className="adm-title-input"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder="Write a clear, keyword-rich title"
            maxLength={200}
            required
          />
        </div>

        <div className="adm-field">
          <label htmlFor="slug">
            URL slug <span className="adm-muted">— {siteHost}/blog/{slug || '…'}</span>
          </label>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTouched(true)
            }}
            onBlur={() => setSlug(slugify(slug || title))}
            placeholder="auto-generated-from-title"
            maxLength={90}
          />
          {post.status === 'published' && slug !== post.slug && (
            <p className="adm-help adm-warn-text">Changing the URL of a published post breaks existing links and rankings.</p>
          )}
        </div>

        <div className="adm-field">
          <span className="adm-label">Content</span>
          <RichTextEditor
            value={post.content}
            onChange={(html) => {
              setContent(html)
              setDirty(true)
            }}
          />
          <p className="adm-help">
            {words} words · Tip: link to partner pages with <code>/go/footography</code> — it is automatically marked as sponsored.
          </p>
        </div>

        <div className="adm-field">
          <label htmlFor="excerpt">
            Excerpt <Counter value={excerpt} min={80} max={200} />
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => touch(setExcerpt)(e.target.value)}
            placeholder="Short summary shown on blog cards and under the title. Leave empty to auto-generate."
            maxLength={400}
          />
        </div>

        <section className="adm-card" aria-labelledby="seo-h">
          <h2 id="seo-h" className="adm-card-title">
            SEO
          </h2>
          <div className="adm-field">
            <label htmlFor="focusKeyword">Focus keyword</label>
            <input
              id="focusKeyword"
              name="focusKeyword"
              value={focusKeyword}
              onChange={(e) => touch(setFocusKeyword)(e.target.value)}
              placeholder="e.g. sell feet pics online"
            />
          </div>
          <div className="adm-field">
            <label htmlFor="metaTitle">
              SEO title <Counter value={metaTitle} min={30} max={60} />
            </label>
            <input
              id="metaTitle"
              name="metaTitle"
              value={metaTitle}
              onChange={(e) => touch(setMetaTitle)(e.target.value)}
              placeholder="Defaults to: Post title | Footography.biz"
              maxLength={120}
            />
          </div>
          <div className="adm-field">
            <label htmlFor="metaDescription">
              Meta description <Counter value={metaDescription} min={120} max={160} />
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={3}
              value={metaDescription}
              onChange={(e) => touch(setMetaDescription)(e.target.value)}
              placeholder="Defaults to the excerpt. Aim for 120–160 characters that make people click."
              maxLength={320}
            />
          </div>
          <SeoPanel
            title={title}
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            slug={slug}
            content={content}
            keyword={focusKeyword}
            coverImage={coverImage}
            excerpt={excerpt}
            siteHost={siteHost}
          />
          <details className="adm-advanced">
            <summary>Advanced SEO</summary>
            <div className="adm-field">
              <label htmlFor="canonicalUrl">Canonical URL (only if this content first appeared elsewhere)</label>
              <input
                id="canonicalUrl"
                name="canonicalUrl"
                type="url"
                value={canonicalUrl}
                onChange={(e) => touch(setCanonicalUrl)(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <label className="adm-check">
              <input type="checkbox" name="noindex" checked={noindex} onChange={(e) => touch(setNoindex)(e.target.checked)} />
              Hide this post from search engines (noindex)
            </label>
          </details>
        </section>
      </div>

      <aside className="adm-editor-side">
        <section className="adm-card" aria-labelledby="publish-h">
          <h2 id="publish-h" className="adm-card-title">
            Publish
          </h2>
          <p className="adm-status-line">
            Status:{' '}
            <span className={`adm-badge adm-badge-${status}`}>{scheduled ? 'scheduled' : status}</span>
            {dirty && <span className="adm-muted"> · unsaved changes</span>}
          </p>
          <div className="adm-field">
            <label htmlFor="publishedLocal">Publish date</label>
            <input
              id="publishedLocal"
              type="datetime-local"
              value={publishedLocal}
              onChange={(e) => touch(setPublishedLocal)(e.target.value)}
            />
            <p className="adm-help">Leave empty to use the moment you publish. A future date schedules the post.</p>
          </div>
          <div className="adm-publish-actions">
            {status === 'published' ? (
              <>
                <button ref={saveBtnRef} className="adm-btn" type="submit" name="intent" value="publish" disabled={pending}>
                  {pending ? 'Saving…' : 'Update'}
                </button>
                <button className="adm-btn adm-btn-ghost" type="submit" name="intent" value="draft" disabled={pending}>
                  Switch to draft
                </button>
              </>
            ) : (
              <>
                <button ref={saveBtnRef} className="adm-btn adm-btn-ghost" type="submit" name="intent" value="draft" disabled={pending}>
                  {pending ? 'Saving…' : 'Save draft'}
                </button>
                <button className="adm-btn" type="submit" name="intent" value="publish" disabled={pending}>
                  Publish
                </button>
              </>
            )}
          </div>
          {post.id && (
            <div className="adm-publish-links">
              <Link href={`/admin/preview/${post.id}`} target="_blank">
                Preview ↗
              </Link>
              {status === 'published' && (
                <Link href={`/blog/${liveSlug}`} target="_blank">
                  View live ↗
                </Link>
              )}
            </div>
          )}
          {state.savedAt && <p className="adm-help">Last saved {new Date(state.savedAt).toLocaleTimeString()}</p>}
          <p className="adm-help">Shortcut: Ctrl + S to save.</p>
        </section>

        <section className="adm-card" aria-labelledby="cover-h">
          <h2 id="cover-h" className="adm-card-title">
            Featured image
          </h2>
          {coverImage ? (
            <div className="adm-cover-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt={coverAlt || 'Featured image'} />
            </div>
          ) : (
            <p className="adm-muted">Shown on blog cards and when the post is shared on social media.</p>
          )}
          <div className="adm-inline-actions">
            <button type="button" className="adm-btn adm-btn-sm" onClick={() => setShowCoverPicker(true)}>
              {coverImage ? 'Change image' : 'Choose image'}
            </button>
            {coverImage && (
              <button type="button" className="adm-btn adm-btn-sm adm-btn-ghost" onClick={() => touch(setCoverImage)('')}>
                Remove
              </button>
            )}
          </div>
          <div className="adm-field">
            <label htmlFor="coverAlt">Image alt text</label>
            <input
              id="coverAlt"
              name="coverAlt"
              value={coverAlt}
              onChange={(e) => touch(setCoverAlt)(e.target.value)}
              placeholder="Describe the image"
              maxLength={200}
            />
          </div>
        </section>

        <section className="adm-card" aria-labelledby="org-h">
          <h2 id="org-h" className="adm-card-title">
            Organise
          </h2>
          <div className="adm-field">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              list="category-options"
              value={category}
              onChange={(e) => touch(setCategory)(e.target.value)}
              maxLength={60}
            />
            <datalist id="category-options">
              {allCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="adm-field">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              id="tags"
              name="tags"
              value={tags}
              onChange={(e) => touch(setTags)(e.target.value)}
              placeholder="privacy, beginners, pricing"
            />
          </div>
          <div className="adm-field">
            <label htmlFor="author">Author</label>
            <input id="author" name="author" value={author} onChange={(e) => touch(setAuthor)(e.target.value)} maxLength={100} />
          </div>
        </section>

        {post.id && (
          <section className="adm-card adm-danger-zone">
            <button
              className="adm-btn adm-btn-danger adm-btn-sm"
              type="submit"
              formAction={deletePostAction}
              formNoValidate
              onClick={(e) => {
                if (!window.confirm('Delete this post permanently? This cannot be undone.')) e.preventDefault()
                else setDirty(false)
              }}
            >
              Delete post
            </button>
          </section>
        )}
      </aside>

      {showCoverPicker && (
        <MediaPicker
          title="Choose featured image"
          onClose={() => setShowCoverPicker(false)}
          onSelect={(img) => {
            setCoverImage(img.url)
            if (!coverAlt && img.alt) setCoverAlt(img.alt)
            setDirty(true)
            setShowCoverPicker(false)
          }}
        />
      )}
    </form>
  )
}
