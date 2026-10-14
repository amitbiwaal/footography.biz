import type { ReactNode } from 'react'

const paths: Record<string, ReactNode> = {
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  dollar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M14.6 9.2c-.6-.8-1.6-1.2-2.7-1.2-1.4 0-2.4.7-2.4 1.9 0 2.6 5.2 1.2 5.2 3.9 0 1.2-1 1.9-2.5 1.9-1.2 0-2.2-.5-2.8-1.3" />
    </>
  ),
  bolt: <path d="M13 2 5 13h6l-1 9 8-12h-6z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V5M4 19h16" />
      <polyline points="7 14 11 10 14 13 20 7" />
      <polyline points="16 7 20 7 20 11" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
      <path d="m9.3 12 1.9 1.9 3.4-3.8" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  badge: (
    <>
      <path d="m9 12 2 2 4-4" />
      <path d="M12 3l2.1 1.6 2.6-.3.9 2.5 2.3 1.4-.9 2.5.9 2.5-2.3 1.4-.9 2.5-2.6-.3L12 21l-2.1-1.6-2.6.3-.9-2.5L4.1 16l.9-2.5L4.1 11l2.3-1.4.9-2.5 2.6.3z" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
  tag: (
    <>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12.2V5a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8z" />
      <circle cx="8" cy="8" r="1.4" />
    </>
  ),
  drop: <path d="M12 3s6 5.6 6 10a6 6 0 0 1-12 0c0-4.4 6-10 6-10z" />,
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M4 13h16M12 9v11" />
      <path d="M12 9C12 6.2 10.6 4.7 9 5.2c-1.5.5-1.1 3 .4 3.8M12 9c0-2.8 1.4-4.3 3-3.8 1.5.5 1.1 3-.4 3.8" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4h3l5 4V6L7 10H4z" />
      <path d="M15 9a3.5 3.5 0 0 1 0 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.2a6 6 0 0 1 3 5.3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
}

export type IconName = keyof typeof paths

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  )
}
