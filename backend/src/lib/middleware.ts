import type { Context, Next } from 'hono'
import { auth } from './auth'
import { errorResponse, ErrorCode } from './errors'

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
    return errorResponse(c, 401, ErrorCode.UNAUTHORIZED, 'Authentication required')
  }
  c.set('user', session.user)
  c.set('session', session.session)
  await next()
}
