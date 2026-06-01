import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
import { requireAuth } from './lib/middleware'
import { handleError, notFoundHandler } from './lib/errors'
import { requestLogger } from './lib/logger'
import { env } from './lib/env'
import { adminPostsRouter } from './routes/admin/posts'

const app = new Hono()

// Middleware
app.use('*', requestLogger)
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

// Structured JSON error handling
app.onError(handleError)
app.notFound(notFoundHandler)

// Chain routes for RPC type inference — typeof captures the full route shape
const routes = app
  .route('/api', api)
  .route('/api/admin/posts', adminPostsRouter)

export type AppType = typeof routes

const port = env.PORT
console.log(`Server running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
