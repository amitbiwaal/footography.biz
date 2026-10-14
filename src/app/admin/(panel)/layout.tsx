import { AdminNav } from '@/components/admin/AdminNav'
import { requireAdmin } from '@/lib/auth'
import { adminStats } from '@/lib/posts'
import { logoutAction } from '../actions'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()
  const stats = await adminStats()

  return (
    <div className="adm-shell">
      <AdminNav
        unread={stats.unread}
        logout={
          <form action={logoutAction}>
            <span className="adm-muted adm-user">{session.email}</span>
            <button type="submit" className="adm-link-btn">
              Sign out
            </button>
          </form>
        }
      />
      <div className="adm-main">{children}</div>
    </div>
  )
}
