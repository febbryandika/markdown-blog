import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { loginSchema } from '@/lib/auth-schema'
import type { LoginInput } from '@/lib/auth-schema'
import { signInWithEmail } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'
import { FormField } from '@/components/FormField'
import { FormError } from '@/components/FormError'
import { SubmitButton } from '@/components/SubmitButton'

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

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
          aria-busy={loading}
        >
          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(v) => {
              setEmail(v)
              setError('')
            }}
            autoComplete="email"
            placeholder="you@example.com"
            disabled={loading}
            error={fieldErrors.email?.[0]}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(v) => {
              setPassword(v)
              setError('')
            }}
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={loading}
            error={fieldErrors.password?.[0]}
          />

          {error && <FormError message={error} />}

          <SubmitButton
            loading={loading}
            label="Sign in"
            loadingLabel="Signing in…"
          />
        </form>
      </div>
    </div>
  )
}
