import { AFFILIATE_URL } from '@/lib/site'

export function CtaBand({
  eyebrow = 'Your Footography Moment',
  title = 'Start Selling Feet Pics Online with Footography Today',
  text = 'Open your free Footography account, upload your first set, and let buyers who are already searching find your feet pics. Privacy stays in your hands, prices stay in your hands, and your first payout could be closer than you think.',
  button = 'Get Started on Footography',
  headingId = 'cta-h',
}: {
  eyebrow?: string
  title?: string
  text?: string
  button?: string
  headingId?: string
}) {
  return (
    <section className="cta-band" aria-labelledby={headingId}>
      <div className="wrap">
        <span className="eyebrow eyebrow-light">{eyebrow}</span>
        <h2 id={headingId}>{title}</h2>
        <p>{text}</p>
        <p className="cta-band-action">
          <a className="btn btn-lg" href={AFFILIATE_URL} rel="nofollow sponsored noopener" target="_blank">
            {button}
          </a>
        </p>
      </div>
    </section>
  )
}
