import type { Context, Next } from 'hono'

export async function requestLogger(c: Context, next: Next) {
  const start = Date.now()
  await next()

  console.log(
    JSON.stringify({
      level: 'info',
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: Date.now() - start,
    })
  )
}

export function logError(payload: Record<string, unknown>) {
  console.error(JSON.stringify({ level: 'error', ...payload }))
}
