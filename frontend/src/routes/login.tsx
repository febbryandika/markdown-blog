import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { loginSchema } from '@/lib/auth-schema'
import type { LoginInput } from '@/lib/auth-schema'
import { signInWithEmail } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  beforeLoad: async ({ search }) => {
    const { data } = await authClient.getSession()
    if (data?.session) {
      throw redirect({ to: search.redirect ?? '/admin' })
    }
  },
  component: LoginPage,
})

type FieldErrors = Partial<Record<keyof LoginInput, string[]>>

function LoginPage() {
  const router = useRouter()
  const { redirect: redirectTo } = Route.useSearch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors)
      return
    }
    setFieldErrors({})
    setLoading(true)

    const { error: authError } = await signInWithEmail(result.data)

    setLoading(false)

    if (authError) {
      setError(authError)
      return
    }

    router.navigate({ to: redirectTo ?? '/admin' })
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-sm">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access the admin area
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-busy={loading}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              autoComplete="email"
              disabled={loading}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-xs text-destructive">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              autoComplete="current-password"
              disabled={loading}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p id="password-error" className="text-xs text-destructive">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
