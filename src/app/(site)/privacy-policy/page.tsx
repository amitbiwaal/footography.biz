import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/site/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const title = 'Privacy Policy'
const description = 'How Footography.biz collects, uses, and protects information when you visit this website or contact us.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/privacy-policy' })

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title={title} description={description} path="/privacy-policy" updated="2026-10-14">
      <p>
        This Privacy Policy explains how {site.name} (“we”, “us”, “our”) handles information when you visit{' '}
        <Link href="/">{site.url.replace(/^https?:\/\//, '')}</Link> (the “Site”). We keep data collection to the minimum needed to
        run the Site.
      </p>

      <h2>Information We Collect</h2>
      <h3>Information you give us</h3>
      <p>
        When you use our <Link href="/contact">contact form</Link>, we collect your name, email address, subject, and message so
        we can reply to you. Please do not send sensitive personal information or images through the form.
      </p>
      <h3>Information collected automatically</h3>
      <p>
        Like most websites, our hosting provider may log technical data such as your IP address, browser type, referring page,
        and the pages you visit. This data is used for security, abuse prevention, and to keep the Site running reliably.
      </p>

      <h2>Cookies</h2>
      <p>
        The public Site does not use advertising or tracking cookies. A strictly necessary cookie is used only in the
        password-protected admin area to keep editors signed in. If we add analytics in the future, we will update this policy
        and, where required, ask for your consent.
      </p>

      <h2>Affiliate Links</h2>
      <p>
        Some links on the Site are affiliate links. When you click one, you leave our Site and the partner website may set its own
        cookies to attribute your sign-up. Those websites have their own privacy policies, and we are not responsible for how they
        handle your data. See our <Link href="/disclaimer">Affiliate Disclaimer</Link> for more details.
      </p>

      <h2>How We Use Information</h2>
      <ul>
        <li>To reply to messages you send us.</li>
        <li>To protect the Site against spam, fraud, and abuse.</li>
        <li>To understand which content is useful so we can improve it.</li>
      </ul>
      <p>We do not sell, rent, or trade your personal information.</p>

      <h2>Data Retention</h2>
      <p>
        Contact messages are kept only as long as needed to respond and for a reasonable period afterwards for record keeping.
        You can ask us to delete your message at any time.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on where you live (for example under the GDPR or CCPA), you may have the right to access, correct, or delete the
        personal information we hold about you, and to object to certain processing. To make a request, email{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>

      <h2>Children</h2>
      <p>
        The Site is intended only for adults aged 18 and over. We do not knowingly collect information from anyone under 18. If you
        believe a minor has contacted us, please let us know and we will delete the information.
      </p>

      <h2>Security</h2>
      <p>
        The Site is served over HTTPS and access to the admin area is password protected. No method of transmission or storage is
        100% secure, but we take reasonable measures to protect the information we hold.
      </p>

      <h2>Changes to This Policy</h2>
      <p>We may update this policy from time to time. The “Last updated” date at the top shows when it was last changed.</p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> or use our{' '}
        <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  )
}
