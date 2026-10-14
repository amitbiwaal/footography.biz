import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/site/CtaBand'
import { Icon } from '@/components/site/Icons'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { breadcrumbLd, graph, organizationLd, pageMetadata, webPageLd } from '@/lib/seo'

const title = 'About Footography.biz — Your Independent Footography Guide'
const description =
  'Footography.biz is an independent guide that explains how Footography works, how to sell feet pics online safely, and how creators can protect their privacy.'
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]

export const metadata: Metadata = pageMetadata({ title, absoluteTitle: true, description, path: '/about' })

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={graph(
          { ...webPageLd({ path: '/about', title, description, type: 'AboutPage' }), about: { '@id': organizationLd['@id'] } },
          organizationLd,
          breadcrumbLd(crumbs),
        )}
      />
      <PageHero
        eyebrow="About Us"
        title="About Footography.biz"
        lead="We are an independent guide for people who want to sell or buy foot photography online without giving up their privacy."
        crumbs={crumbs}
      />

      <section aria-labelledby="mission-h">
        <div className="wrap">
          <div className="grid g2">
            <div>
              <h2 id="mission-h">Why This Guide Exists</h2>
              <p>
                Selling feet pics online has become a real side income for thousands of people, but most of the advice out there is
                scattered, outdated, or written to push a sale. New creators get stuck on the same questions: Is the platform legit?
                How do payouts work? How do I stay anonymous? What should I charge?
              </p>
              <p>
                Footography.biz brings those answers together in one place. We explain how the Footography marketplace works in plain
                language, publish step-by-step guides on our <Link href="/blog">blog</Link>, and focus on the part that matters most to
                creators in this niche: safety and privacy.
              </p>
            </div>
            <div>
              <h2>What You Will Find Here</h2>
              <ul className="checks">
                <li><strong>Platform explainers.</strong> How Footography accounts, pricing, and payouts work.</li>
                <li><strong>Privacy-first guides.</strong> Watermarking, anonymity, and protecting your identity.</li>
                <li><strong>Practical photo tips.</strong> Lighting, framing, and sets that buyers actually want.</li>
                <li><strong>Honest expectations.</strong> Earnings depend on effort, quality, and consistency, and we say so.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="alt" aria-labelledby="values-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Our Principles</span>
            <h2 id="values-h">How We Write and Review Content</h2>
          </div>
          <div className="grid g3">
            <article className="card">
              <div className="icon"><Icon name="shield" /></div>
              <h3>Safety Comes First</h3>
              <p>Every guide starts with how to protect your identity, your content, and your payments before it talks about earnings.</p>
            </article>
            <article className="card">
              <div className="icon"><Icon name="badge" /></div>
              <h3>Clear and Honest</h3>
              <p>No get-rich-quick promises. We explain what works, what does not, and what depends on you.</p>
            </article>
            <article className="card">
              <div className="icon"><Icon name="calendar" /></div>
              <h3>Kept Up to Date</h3>
              <p>Platforms change. We review our guides regularly and update them when features, fees, or policies change.</p>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="independent-h">
        <div className="wrap">
          <h2 id="independent-h">Independent and Transparent</h2>
          <p className="lead">
            Footography.biz is not owned or operated by Footography. Some links on this site are affiliate links, which means we may
            earn a commission if you sign up, at no extra cost to you. This never changes what we write. Read our full{' '}
            <Link href="/disclaimer">affiliate disclaimer</Link> for details.
          </p>
          <p>
            All content on this site is intended for adults aged 18 and over. Have a question or a correction?{' '}
            <Link href="/contact">Get in touch</Link> and we will get back to you.
          </p>
        </div>
      </section>

      <CtaBand headingId="about-cta-h" />
    </>
  )
}
