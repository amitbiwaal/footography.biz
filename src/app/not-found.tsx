import type { Metadata } from 'next'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { NotFoundContent } from '@/components/site/NotFoundContent'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
}

export default function RootNotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  )
}
