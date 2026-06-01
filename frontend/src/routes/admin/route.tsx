import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAuth } from '@/lib/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => requireAuth(location.href),
  component: () => <Outlet />,
})
