import type { Context, Next } from 'hono'
import { auth } from './auth'

type AuthSession = typeof auth.$Infer.Session

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthSession['user']
    session: AuthSession['session']
  }
}

export async function requireAuth(c: Context, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  c.set('user', session.user)
  c.set('session', session.session)
  await next()
}
