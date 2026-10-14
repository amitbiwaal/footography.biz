import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@/components/site/Icons'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { breadcrumbLd, graph, pageMetadata, webPageLd } from '@/lib/seo'
import { site } from '@/lib/site'
import { ContactForm } from './ContactForm'

const title = 'Contact Us'
const description =
  'Get in touch with the Footography.biz team. Send us your questions about selling feet pics online, corrections, or partnership requests.'
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

export const metadata: Metadata = pageMetadata({ title, description, path: '/contact' })

export default function ContactPage() {
  return (
    <>
      <JsonLd data={graph(webPageLd({ path: '/contact', title, description, type: 'ContactPage' }), breadcrumbLd(crumbs))} />
      <PageHero
        eyebrow="Contact"
        title="Contact Footography.biz"
        lead="Questions, corrections, or partnership ideas? Send us a message and we will reply as soon as we can."
        crumbs={crumbs}
      />
      <section aria-label="Contact form">
        <div className="wrap contact-grid">
          <div className="card">
            <h2 style={{ fontSize: '1.4rem' }}>Send a Message</h2>
            <ContactForm />
          </div>
          <aside className="grid" style={{ gap: 18 }}>
            <div className="card">
              <div className="icon"><Icon name="mail" /></div>
              <h3>Email</h3>
              <p>
                <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              </p>
            </div>
            <div className="card">
              <div className="icon teal"><Icon name="clock" /></div>
              <h3>Response Time</h3>
              <p>We usually reply within 2 business days.</p>
            </div>
            <div className="card">
              <div className="icon"><Icon name="shield" /></div>
              <h3>Account Questions</h3>
              <p>
                We are an independent guide and cannot access Footography accounts or payouts. For account issues, contact
                Footography support directly. See our <Link href="/disclaimer">disclaimer</Link>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
