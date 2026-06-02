import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useSession, authClient } from '@/lib/auth-client'
import { ThemeToggle } from '@/components/ThemeToggle'
import { env } from '@/lib/env'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

const navLink =
  'font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-brand'

function NavAuth() {
  const { data, isPending } = useSession()
  const router = useRouter()

  if (isPending) {
    return (
      <span
        className="h-4 w-12 animate-pulse rounded bg-muted"
        aria-hidden="true"
      />
    )
  }

  if (data?.session) {
    return (
      <>
        <Link
          to="/admin"
          className={navLink}
          activeProps={{ 'aria-current': 'page' }}
        >
          Admin
        </Link>
        <button
          type="button"
          className={navLink}
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
    <Link to="/login" className={navLink}>
      Login
    </Link>
  )
}

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 w-full max-w-6xl items-center gap-5 px-4 sm:gap-6 sm:px-6"
        >
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="font-display text-xl font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            My Project<span className="text-brand">.</span>
          </Link>
          <Link
            to="/blog"
            className={navLink}
            activeProps={{ 'aria-current': 'page' }}
          >
            Blog
          </Link>
          <div className="ml-auto flex items-center gap-4 sm:gap-5">
            <NavAuth />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 focus:outline-none sm:px-6 sm:py-12"
      >
        <Outlet />
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-display text-base text-foreground">
            My Project<span className="text-brand">.</span>
          </p>
          <nav
            aria-label="Footer"
            className="flex items-center gap-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground"
          >
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link to="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
            <a
              href={`${env.VITE_API_URL}/feed`}
              className="transition-colors hover:text-foreground"
            >
              RSS
            </a>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} · Written &amp; published with care
          </p>
        </div>
      </footer>
    </div>
  )
}
