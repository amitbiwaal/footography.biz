import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // CSS is small (~5 KB gzipped), so inlining it removes a render-blocking request for first-time visitors
    inlineCss: true,
    serverActions: {
      // Long blog posts are sent as HTML through a Server Action
      bodySizeLimit: '4mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
  },
  async redirects() {
    return [
      // Old static landing page URL
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/affiliate-disclosure', destination: '/disclaimer', permanent: true },
      { source: '/blog/page/1', destination: '/blog', permanent: true },
      // Asset URLs from the old static site (may be cached in social shares)
      { source: '/assets/logo.png', destination: '/logo.png', permanent: true },
      { source: '/assets/og-image.png', destination: '/og-image.jpg', permanent: true },
      { source: '/assets/favicon.png', destination: '/icon.png', permanent: true },
    ]
  },
}

export default nextConfig
