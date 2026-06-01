import { createFileRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import { requireAuth } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => requireAuth(location.href),
  component: AdminLayout,
})

function AdminLayout() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.navigate({ to: '/' })
  }

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
        <button
          type="button"
          onClick={handleSignOut}
          className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </nav>
      <Outlet />
    </div>
  )
}
