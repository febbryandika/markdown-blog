import { describe, it, expect, beforeEach } from 'vitest'
import { adminPostsRouter } from '@/routes/admin/posts'
import { makeApp, req, setSession, fakeSession } from './utils'

const base = '/api/admin/posts'
const app = makeApp(base, adminPostsRouter)

describe('invalid payload validation', () => {
  beforeEach(() => setSession(fakeSession))

  it('rejects a missing required field (title) with 400 VALIDATION_ERROR', async () => {
    const res = await req(app, 'POST', base, {
      content: 'body without a title',
    })

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error.code).toBe('VALIDATION_ERROR')
    expect(body.error.message).toMatch(/title/i)
  })

  it('rejects a malformed field (invalid coverImage URL) with 400 VALIDATION_ERROR', async () => {
    const res = await req(app, 'POST', base, {
      title: 'Valid',
      coverImage: 'not-a-url',
    })

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error.code).toBe('VALIDATION_ERROR')
    expect(body.error.message).toMatch(/coverImage/i)
  })
})
