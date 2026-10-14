'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/posts', label: 'All Posts', icon: '☰' },
  { href: '/admin/posts/new', label: 'Write New Post', icon: '✎' },
  { href: '/admin/media', label: 'Media Library', icon: '🖼' },
  { href: '/admin/messages', label: 'Messages', icon: '✉' },
]

export function AdminNav({ unread, logout }: { unread: number; logout: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  const active = (href: string) =>
    href === '/admin'
      ? pathname === '/admin'
      : href === '/admin/posts'
        ? pathname === '/admin/posts' || /^\/admin\/posts\/\d+/.test(pathname)
        : pathname.startsWith(href)

  return (
    <>
      <div className="adm-topbar">
        <Link href="/admin" className="adm-brand">
          Footography<span>.biz</span> CMS
        </Link>
        <button
          type="button"
          className="adm-menu-toggle"
          aria-expanded={open}
          aria-controls="adm-sidebar"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕ Close' : '☰ Menu'}
        </button>
      </div>
      <aside id="adm-sidebar" className={`adm-sidebar${open ? ' is-open' : ''}`}>
        <Link href="/admin" className="adm-brand adm-brand-desktop">
          Footography<span>.biz</span> CMS
        </Link>
        <nav aria-label="Admin">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={active(l.href) ? 'page' : undefined}>
                  <span aria-hidden="true">{l.icon}</span> {l.label}
                  {l.href === '/admin/messages' && unread > 0 && <span className="adm-pill">{unread}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="adm-sidebar-foot">
          <a href="/" target="_blank" rel="noopener">
            View website ↗
          </a>
          {logout}
        </div>
      </aside>
    </>
  )
}
