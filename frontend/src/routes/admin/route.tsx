import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { requireAuth } from '@/lib/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => requireAuth(location.href),
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div>
      <nav aria-label="Admin navigation" className="mb-6 flex items-center gap-4 border-b pb-4">
        <Link
          to="/admin/"
          className="text-sm font-medium hover:text-primary transition-colors"
          activeProps={{ className: 'text-primary' }}
        >
          Dashboard
        </Link>
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View site
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}
