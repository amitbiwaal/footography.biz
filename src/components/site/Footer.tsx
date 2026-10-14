import Image from 'next/image'
import Link from 'next/link'
import { footerNav, site } from '@/lib/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label={`${site.brand} home`} className="footer-logo">
              <Image src={site.logo.src} alt={site.brand} width={158} height={44} />
            </Link>
            <p>
              An independent guide to Footography: how the marketplace works, how to sell feet pics online safely, and how to
              protect your privacy while you earn.
            </p>
          </div>
          <nav aria-label="Explore">
            <h2 className="footer-title">Explore</h2>
            <ul>
              {footerNav.explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Guide">
            <h2 className="footer-title">Guide</h2>
            <ul>
              {footerNav.guide.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal">
            <h2 className="footer-title">Legal</h2>
            <ul>
              {footerNav.legal.map((l) => (
                <li key={l.href}>
                  {l.href.endsWith('.xml') ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="footer-disclaimer">
          Footography.biz is an independent and unofficial affiliate website created for informational purposes. We may earn a
          commission from qualifying actions taken through links on this site at no extra cost to you. This site is not
          officially affiliated with, endorsed by, or operated by Footography or footography.com. All trademarks, brand names,
          and logos are the property of their respective owners. Content is intended for adults (18+) seeking legitimate ways to
          buy or sell foot photography online.
        </p>
        <p className="footer-copy">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
