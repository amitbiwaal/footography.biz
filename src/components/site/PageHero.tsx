import { Breadcrumbs } from './Breadcrumbs'

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
}: {
  eyebrow?: string
  title: string
  lead?: string
  crumbs: { name: string; path: string }[]
}) {
  return (
    <section className="page-hero" aria-labelledby="page-h1">
      <div className="wrap">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 id="page-h1">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  )
}
