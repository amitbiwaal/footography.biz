import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { adminConfigured } from '@/lib/auth'
import { site } from '@/lib/site'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const { next } = await searchParams
  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <Link href="/" className="adm-login-logo">
          <Image src={site.logo.src} alt={site.brand} width={172} height={48} preload />
        </Link>
        <h1>Admin sign in</h1>
        <p className="adm-muted">Manage blog posts, media and messages.</p>
        {!adminConfigured() && (
          <p className="adm-alert adm-alert-error">
            Admin login is not configured. Add ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET to your environment.
          </p>
        )}
        <LoginForm next={typeof next === 'string' ? next : ''} />
      </div>
    </div>
  )
}
