import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/site/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const title = 'Terms of Use'
const description = 'The terms and conditions that apply when you use the Footography.biz website and its content.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/terms' })

export default function TermsPage() {
  return (
    <LegalPage title={title} description={description} path="/terms" updated="2026-10-14">
      <p>
        By accessing or using {site.name} (the “Site”), you agree to these Terms of Use. If you do not agree, please do not use the
        Site.
      </p>

      <h2>Eligibility</h2>
      <p>The Site is intended for adults aged 18 or older. By using the Site you confirm that you are at least 18 years old.</p>

      <h2>Informational Purposes Only</h2>
      <p>
        All content on the Site is provided for general information and education. It is not financial, legal, or tax advice.
        Earnings from selling photos online vary and are never guaranteed. You are responsible for your own decisions and for
        complying with the laws and tax rules that apply where you live.
      </p>

      <h2>Independent Website</h2>
      <p>
        {site.name} is an independent website and is not owned, operated, or endorsed by Footography or any marketplace mentioned
        on the Site. Any account, purchase, or payout on a third-party platform is governed solely by that platform’s own terms.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        The Site contains links to third-party websites, including affiliate links. We do not control and are not responsible for
        the content, policies, or practices of those websites. Please read their terms and privacy policies before signing up. See
        our <Link href="/disclaimer">Affiliate Disclaimer</Link>.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        Unless stated otherwise, the text, design, and graphics on the Site belong to {site.name}. You may share links to our pages
        and quote short excerpts with a link back to the source. You may not copy or republish full articles without written
        permission. Third-party trademarks and logos remain the property of their owners.
      </p>

      <h2>Acceptable Use</h2>
      <ul>
        <li>Do not use the Site for any unlawful purpose.</li>
        <li>Do not attempt to gain unauthorized access to any part of the Site, including the admin area.</li>
        <li>Do not send spam, malware, or abusive content through our contact form.</li>
        <li>Do not scrape the Site in a way that harms its performance.</li>
      </ul>

      <h2>No Warranties</h2>
      <p>
        The Site is provided “as is” and “as available”. We work to keep information accurate and up to date, but we make no
        warranties about its completeness, reliability, or availability.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, {site.name} is not liable for any loss or damage arising from your use of the Site
        or from any third-party website you visit through it.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms at any time. Continued use of the Site after changes are posted means you accept the updated
        Terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> or visit our{' '}
        <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  )
}
