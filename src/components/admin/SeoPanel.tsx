'use client'

type Check = { ok: boolean; warn?: boolean; label: string }

function textFromHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
}

export function analyse({
  title,
  metaTitle,
  metaDescription,
  slug,
  content,
  keyword,
  coverImage,
  excerpt,
}: {
  title: string
  metaTitle: string
  metaDescription: string
  slug: string
  content: string
  keyword: string
  coverImage: string
  excerpt: string
}) {
  const text = textFromHtml(content)
  const words = text ? text.split(' ').length : 0
  const kw = keyword.trim().toLowerCase()
  const seoTitle = metaTitle || title
  const desc = metaDescription || excerpt
  const firstPara = textFromHtml(content.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '').toLowerCase()
  const h2Count = (content.match(/<h2[\s>]/g) || []).length
  const images = content.match(/<img[^>]*>/g) || []
  const imagesMissingAlt = images.filter((img) => !/alt="[^"]+"/.test(img)).length
  const links = [...content.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1])
  const internal = links.filter((h) => h.startsWith('/') || h.includes('footography.biz')).length
  const kwCount = kw ? text.toLowerCase().split(kw).length - 1 : 0
  const density = words && kw ? (kwCount * kw.split(' ').length * 100) / words : 0

  const checks: Check[] = [
    {
      ok: seoTitle.length >= 30 && seoTitle.length <= 60,
      warn: seoTitle.length > 0,
      label: `SEO title length: ${seoTitle.length} characters (aim for 30–60)`,
    },
    {
      ok: desc.length >= 120 && desc.length <= 160,
      warn: desc.length > 0,
      label: `Meta description length: ${desc.length} characters (aim for 120–160)`,
    },
    { ok: words >= 800, warn: words >= 300, label: `Content length: ${words} words (800+ recommended)` },
    { ok: h2Count >= 2, label: `Subheadings: ${h2Count} H2 heading(s) (use at least 2)` },
    { ok: internal >= 2, warn: internal >= 1, label: `Internal links: ${internal} (link to at least 2 related pages)` },
    { ok: imagesMissingAlt === 0, label: imagesMissingAlt ? `${imagesMissingAlt} image(s) missing alt text` : 'All images have alt text' },
    { ok: Boolean(coverImage), label: coverImage ? 'Featured image is set' : 'Add a featured (cover) image' },
  ]
  if (kw) {
    checks.unshift(
      { ok: seoTitle.toLowerCase().includes(kw), label: 'Focus keyword appears in the SEO title' },
      { ok: desc.toLowerCase().includes(kw), label: 'Focus keyword appears in the meta description' },
      { ok: slug.includes(kw.replace(/\s+/g, '-')), warn: kw.split(' ').some((w) => slug.includes(w)), label: 'Focus keyword appears in the URL slug' },
      { ok: firstPara.includes(kw), label: 'Focus keyword appears in the first paragraph' },
      {
        ok: density >= 0.5 && density <= 2.5,
        warn: kwCount > 0,
        label: `Keyword density: ${density.toFixed(1)}% (${kwCount}×, aim for 0.5–2.5%)`,
      },
    )
  } else {
    checks.unshift({ ok: false, warn: true, label: 'Set a focus keyword to get keyword checks' })
  }
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
  return { checks, score, words }
}

export function SeoPanel(props: Parameters<typeof analyse>[0] & { siteHost: string }) {
  const { checks, score } = analyse(props)
  const seoTitle = props.metaTitle || `${props.title || 'Post title'} | Footography.biz`
  const desc = props.metaDescription || props.excerpt || 'Add a meta description to control how this post appears in Google.'
  const scoreClass = score >= 80 ? 'good' : score >= 50 ? 'ok' : 'bad'

  return (
    <div className="adm-seo">
      <div className="adm-serp" aria-label="Google search preview">
        <div className="adm-serp-url">
          {props.siteHost} › blog › {props.slug || 'post-url'}
        </div>
        <div className="adm-serp-title">{seoTitle.length > 62 ? `${seoTitle.slice(0, 60)}…` : seoTitle}</div>
        <div className="adm-serp-desc">{desc.length > 162 ? `${desc.slice(0, 158)}…` : desc}</div>
      </div>

      <div className="adm-seo-score">
        <span className={`adm-score adm-score-${scoreClass}`}>{score}</span>
        <span>SEO score</span>
      </div>
      <ul className="adm-checks">
        {checks.map((c) => (
          <li key={c.label} className={c.ok ? 'is-ok' : c.warn ? 'is-warn' : 'is-bad'}>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
