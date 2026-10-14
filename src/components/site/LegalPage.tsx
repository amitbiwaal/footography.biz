import { JsonLd } from './JsonLd'
import { PageHero } from './PageHero'
import { breadcrumbLd, graph, webPageLd } from '@/lib/seo'
import { formatDate } from '@/lib/text'

export function LegalPage({
  title,
  description,
  path,
  updated,
  children,
}: {
  title: string
  description: string
  path: string
  updated: string
  children: React.ReactNode
}) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: title, path },
  ]
  return (
    <>
      <JsonLd data={graph({ ...webPageLd({ path, title, description }), dateModified: updated }, breadcrumbLd(crumbs))} />
      <PageHero eyebrow="Legal" title={title} lead={description} crumbs={crumbs} />
      <section>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <p className="small-note" style={{ marginTop: 0 }}>
            Last updated: <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
          <div className="prose">{children}</div>
        </div>
      </section>
    </>
  )
}
