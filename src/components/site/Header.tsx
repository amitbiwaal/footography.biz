'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AFFILIATE_URL, mainNav, site } from '@/lib/site'
import { Icon } from './Icons'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile menu after navigating or pressing Escape
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) =>
    !href.includes('#') && (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand-mark" href="/" aria-label={`${site.brand} home`}>
          <Image
            src={site.logo.src}
            alt={site.brand}
            width={172}
            height={48}
            className="brand-logo"
            preload
          />
        </Link>

        <button
          type="button"
          className="hamburger"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="primary-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>

        <nav id="primary-menu" className={`menu${open ? ' is-open' : ''}`} aria-label="Primary">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a className="btn" href={AFFILIATE_URL} rel="nofollow sponsored noopener" target="_blank">
            Visit Footography
          </a>
        </nav>
      </div>
    </header>
  )
}
