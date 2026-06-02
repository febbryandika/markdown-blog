import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useSession, authClient } from '@/lib/auth-client'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function NavAuth() {
  const { data, isPending } = useSession()
  const router = useRouter()

  if (isPending) {
    return (
      <span
        className="h-4 w-16 animate-pulse rounded bg-muted"
        aria-hidden="true"
      />
    )
  }

  if (data?.session) {
    return (
      <>
        <Link
          to="/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Admin
        </Link>
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground"
          onClick={async () => {
            await authClient.signOut()
            router.navigate({ to: '/' })
          }}
        >
          Sign out
        </button>
      </>
    )
  }

  return (
    <Link
      to="/login"
      className="text-sm text-muted-foreground hover:text-foreground"
    >
      Login
    </Link>
  )
}

function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className="border-b px-4 sm:px-6 py-3 flex flex-wrap items-center gap-4"
      >
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ 'aria-current': 'page' }}
          className="font-semibold text-foreground transition-colors hover:text-primary aria-[current=page]:text-primary"
        >
          My Project
        </Link>
        <Link
          to="/blog"
          activeProps={{ 'aria-current': 'page' }}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-primary"
        >
          Blog
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <NavAuth />
        </div>
      </nav>
      <main
        id="main-content"
        tabIndex={-1}
        className="container mx-auto px-4 sm:px-6 py-8 focus:outline-none"
      >
        <Outlet />
      </main>
    </div>
  )
}
