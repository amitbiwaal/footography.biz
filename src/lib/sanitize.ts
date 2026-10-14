import 'server-only'
import sanitizeHtml from 'sanitize-html'
import { SITE_URL, outboundLinks } from './site'
import { slugify } from './text'

const siteHost = new URL(SITE_URL).host
const affiliateHosts = Object.values(outboundLinks).map((u) => new URL(u).host)

function classifyLink(href: string): 'internal' | 'affiliate' | 'external' {
  if (href.startsWith('/go/')) return 'affiliate'
  if (href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return 'internal'
  try {
    const host = new URL(href).host
    if (host === siteHost || host === `www.${siteHost}`) return 'internal'
    if (affiliateHosts.includes(host)) return 'affiliate'
  } catch {
    return 'internal'
  }
  return 'external'
}

/**
 * Cleans HTML coming from the admin editor before it is stored.
 * - Only allows content tags (no scripts, styles, iframes or inline event handlers)
 * - Turns H1 into H2 so every page keeps a single H1
 * - Adds correct rel/target to external and affiliate links
 * - Lazy-loads images
 */
export function sanitizePostHtml(dirty: string) {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote',
      'pre', 'code', 'hr', 'br', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'mark', 'sup', 'sub',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      code: ['class'],
    },
    allowedClasses: { code: [/^language-[a-z0-9-]+$/] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      h1: 'h2',
      h5: 'h4',
      h6: 'h4',
      b: 'strong',
      i: 'em',
      a: (tagName, attribs) => {
        const href = (attribs.href || '').trim()
        // Unsafe schemes (javascript:, data:, …) leave plain text behind
        if (!/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href)) return { tagName, attribs: {} }
        const kind = classifyLink(href)
        const out: Record<string, string> = { href }
        if (attribs.title) out.title = attribs.title
        if (kind === 'affiliate') {
          out.rel = 'sponsored nofollow noopener'
          out.target = '_blank'
        } else if (kind === 'external') {
          out.rel = 'noopener noreferrer'
          out.target = '_blank'
        }
        return { tagName, attribs: out }
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: 'lazy', decoding: 'async', alt: attribs.alt ?? '' },
      }),
    },
    exclusiveFilter: (frame) =>
      // Drop empty paragraphs/headings left behind by the editor
      ['p', 'h2', 'h3', 'h4'].includes(frame.tag) && !frame.text.trim() && !frame.mediaChildren.length,
  })
}

export type TocItem = { id: string; text: string; level: 2 | 3 }

/** Adds stable id attributes to H2/H3 headings and returns a table of contents. */
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  const used = new Set<string>()
  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, level: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim()
    let id = slugify(text) || 'section'
    let n = 2
    while (used.has(id)) id = `${slugify(text)}-${n++}`
    used.add(id)
    toc.push({ id, text, level: Number(level) as 2 | 3 })
    return `<h${level} id="${id}">${inner}</h${level}>`
  })
  return { html: out, toc }
}
