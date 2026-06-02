import { redirect } from '@tanstack/react-router'
import { authClient } from './auth-client'
import type { LoginInput } from './auth-schema'

/** Throws a redirect to /login if no active session. Used in route beforeLoad. */
export async function requireAuth(redirectTo?: string) {
  const { data } = await authClient.getSession()
  if (!data?.session) {
    throw redirect({
      to: '/login',
      search: redirectTo ? { redirect: redirectTo } : undefined,
    })
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid email or password': 'Invalid email or password.',
  'Too many requests': 'Too many attempts. Please wait and try again.',
}

function mapAuthError(message: string | undefined): string {
  if (!message) return 'Unable to sign in. Please try again.'
  return ERROR_MESSAGES[message] ?? 'Invalid email or password.'
}

export async function signInWithEmail(
  input: LoginInput,
): Promise<{ error: string | null }> {
  try {
    const { error } = await authClient.signIn.email(input)
    if (error) return { error: mapAuthError(error.message) }
    return { error: null }
  } catch {
    return { error: 'Unable to sign in. Please try again.' }
  }
}
