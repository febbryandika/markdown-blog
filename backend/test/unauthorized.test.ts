import { describe, it, expect } from 'vitest'
import { adminPostsRouter } from '@/routes/admin/posts'
import { makeApp, req } from './utils/app'

const base = '/api/admin/posts'
const app = makeApp(base, adminPostsRouter)

// No session is set — the global beforeEach resets it to null, so every
// request here is anonymous and requireAuth should reject it before any handler.
describe('unauthorized access to admin posts', () => {
  const cases: Array<[string, string]> = [
    ['GET', base],
    ['POST', base],
    ['GET', `${base}/some-id`],
    ['PUT', `${base}/some-id`],
    ['DELETE', `${base}/some-id`],
    ['POST', `${base}/preview`],
  ]

  it.each(cases)('%s %s → 401 UNAUTHORIZED', async (method, path) => {
    const res = await req(app, method, path)

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    })
  })
})
