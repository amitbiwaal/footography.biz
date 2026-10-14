export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://footography.biz').replace(/\/+$/, '')

export const site = {
  name: 'Footography.biz',
  brand: 'Footography',
  url: SITE_URL,
  title: 'Footography Makes Selling Feet Pics Online Simple',
  description:
    'Start selling feet pics online with Footography, a simple platform designed for private content sales and secure creator payouts.',
  locale: 'en_US',
  ogImage: { url: '/og-image.jpg', width: 1731, height: 909, alt: 'Footography — Sell Feet Pics Online Privately and Safely' },
  logo: { src: '/logo.png', width: 520, height: 145 },
  themeColor: '#6d28d9',
  defaultAuthor: 'Footography.biz Editorial Team',
  contactEmail: 'hello@footography.biz',
}

/** Outbound partner links. Use /go/<key> inside blog posts so links can be changed in one place. */
export const outboundLinks: Record<string, string> = {
  footography:
    'https://app.feetfinder.com/affiliate/link?af_id=97c365207f4d8-615933c06e600f70fe8-024240575f3229cc-1909bce247abe2cc48',
}

export const AFFILIATE_URL = '/go/footography'

export const mainNav = [
  { href: '/about', label: 'About' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/blog', label: 'Blog' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export const footerNav = {
  explore: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  guide: [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#safety', label: 'Privacy & Safety' },
    { href: '/#faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/disclaimer', label: 'Affiliate Disclaimer' },
    { href: '/feed.xml', label: 'RSS Feed' },
  ],
}

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
