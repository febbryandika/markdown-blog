import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { requireAuth } from '@/lib/middleware'
import { setSession, fakeSession } from './utils'

// Mount the real `requireAuth` on a minimal app and drive it through both paths.
const app = new Hono()
  .use('*', requireAuth)
  .get('/whoami', (c) => c.json({ user: c.get('user') }))

describe('requireAuth middleware', () => {
  it('rejects requests with no session (401 UNAUTHORIZED)', async () => {
    const res = await app.request('/whoami')

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    })
  })

  it('passes through and exposes the user when a session exists', async () => {
    setSession(fakeSession)

    const res = await app.request('/whoami')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      user: { id: 'test-user', email: 'admin@example.com' },
    })
  })
})
