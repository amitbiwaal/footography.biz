import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/site/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const title = 'Affiliate Disclaimer'
const description =
  'Footography.biz is an independent affiliate website. Learn how affiliate links work on this site and how we keep our content independent.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/disclaimer' })

export default function DisclaimerPage() {
  return (
    <LegalPage title={title} description={description} path="/disclaimer" updated="2026-10-14">
      <h2>Independent and Unofficial</h2>
      <p>
        {site.name} is an independent and unofficial affiliate website created for informational purposes. It is not officially
        affiliated with, endorsed by, or operated by Footography or footography.com. All trademarks, brand names, and logos are the
        property of their respective owners and are used only to identify the services we write about.
      </p>

      <h2>How Affiliate Links Work</h2>
      <p>
        Some links on this Site are affiliate links. If you click one and then sign up or make a qualifying purchase, we may earn a
        commission. This comes at <strong>no extra cost to you</strong>. Affiliate links are marked with{' '}
        <code>rel=&quot;sponsored&quot;</code> in our code, as recommended by search engines.
      </p>

      <h2>Our Editorial Independence</h2>
      <p>
        Commissions help us keep the Site running, but they do not decide what we write. We aim to describe features, privacy tools,
        and limitations honestly, and we encourage you to read each platform’s own terms before joining.
      </p>

      <h2>No Guarantees of Earnings</h2>
      <p>
        Any examples of income on this Site are illustrations, not promises. Results depend on photo quality, pricing, consistency,
        promotion, and market demand. Many people earn little or nothing, and you should never invest money you cannot afford to
        lose.
      </p>

      <h2>Adults Only</h2>
      <p>
        Content on this Site is intended for adults (18+) seeking legitimate ways to buy or sell foot photography online. Always
        follow the rules of the platform you use and the laws of your country.
      </p>

      <h2>Questions</h2>
      <p>
        If you have any questions about this disclaimer, please <Link href="/contact">contact us</Link> or email{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  )
}
