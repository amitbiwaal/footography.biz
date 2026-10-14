'use client'

export function ConfirmButton({
  message,
  className = 'adm-link-btn adm-danger-text',
  children,
}: {
  message: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </button>
  )
}

export function CopyButton({ text, label = 'Copy URL' }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      className="adm-link-btn"
      onClick={async (e) => {
        const btn = e.currentTarget
        const url = text.startsWith('/') ? `${window.location.origin}${text}` : text
        try {
          await navigator.clipboard.writeText(url)
          btn.textContent = 'Copied!'
        } catch {
          window.prompt('Copy this URL:', url)
        }
        setTimeout(() => (btn.textContent = label), 1500)
      }}
    >
      {label}
    </button>
  )
}
