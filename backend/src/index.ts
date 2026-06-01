import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { auth } from './lib/auth'
import { requireAuth } from './lib/middleware'
import { handleError, notFoundHandler } from './lib/errors'
import { env } from './lib/env'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: env.FRONTEND_URL,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)

// Auth routes — better-auth handles /api/auth/**
app.on(['GET', 'POST'], '/api/auth/**', (c) => auth.handler(c.req.raw))

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }))

// Protected routes example
const api = new Hono()
api.use('*', requireAuth)

api.get('/me', (c) => {
  const user = c.get('user')
  return c.json({ user })
})

app.route('/api', api)

// Structured JSON error handling
app.onError(handleError)
app.notFound(notFoundHandler)

// Export for RPC type inference
export type AppType = typeof app

const port = env.PORT
console.log(`Server running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
