import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isRedirect } from '@tanstack/react-router'
import { requireAuth } from '@/lib/auth'

// Control the better-auth client's getSession; the real redirect() runs so we
// can assert on the redirect it throws.
const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }))
vi.mock('@/lib/auth-client', () => ({ authClient: { getSession } }))

describe('requireAuth (admin route guard)', () => {
  beforeEach(() => getSession.mockReset())

  it('redirects to /login (preserving the target) when there is no session', async () => {
    getSession.mockResolvedValue({ data: null })

    const thrown = await requireAuth('/admin').then(
      () => undefined,
      (err: unknown) => err,
    )

    expect(isRedirect(thrown)).toBe(true)
    expect((thrown as Response & { options: unknown }).options).toMatchObject({
      to: '/login',
      search: { redirect: '/admin' },
    })
  })

  it('does not redirect when a session exists', async () => {
    getSession.mockResolvedValue({
      data: { session: { id: 's1' }, user: { id: 'u1' } },
    })

    await expect(requireAuth('/admin')).resolves.toBeUndefined()
  })
})
