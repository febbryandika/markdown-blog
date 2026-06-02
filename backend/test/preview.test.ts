import { describe, it, expect, beforeEach } from 'vitest'
import { Hono } from 'hono'
import { adminPostsRouter } from '@/routes/admin/posts'
import { setSession, fakeSession } from './utils'

const app = new Hono().route('/api/admin/posts', adminPostsRouter)

function preview(content: string) {
  return app.request('/api/admin/posts/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
}

describe('POST /api/admin/posts/preview', () => {
  beforeEach(() => setSession(fakeSession))

  it('renders Markdown to HTML', async () => {
    const res = await preview('# Hello\n\nSome **bold** text.')

    expect(res.status).toBe(200)
    const { html } = await res.json()
    expect(html).toContain('<h1>Hello</h1>')
    expect(html).toContain('<strong>bold</strong>')
  })

  it('sanitizes dangerous markup (no script tags or javascript: URLs)', async () => {
    const res = await preview(
      '[x](javascript:alert(1)) and <script>alert(2)</script>',
    )

    expect(res.status).toBe(200)
    const { html } = await res.json()
    expect(html).not.toContain('<script')
    expect(html).not.toContain('javascript:')
  })
})
