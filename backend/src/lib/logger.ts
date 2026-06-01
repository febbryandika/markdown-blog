import type { Context, Next } from 'hono'

export async function requestLogger(c: Context, next: Next) {
  await next()

  console.log(
    JSON.stringify({
      level: 'info',
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
    })
  )
}
