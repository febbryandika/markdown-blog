import { describe, it, expect, beforeEach } from 'vitest'
import { adminPostsRouter } from '@/routes/admin/posts'
import { makeApp, req } from './utils/app'
import { buildPostInput } from './utils/factories'
import { setSession, fakeSession } from './setup'

const base = '/api/admin/posts'
const app = makeApp(base, adminPostsRouter)

async function create(overrides: Parameters<typeof buildPostInput>[0]) {
  const res = await req(app, 'POST', base, buildPostInput(overrides))
  expect(res.status).toBe(201)
  return res.json()
}

describe('slug uniqueness', () => {
  beforeEach(() => setSession(fakeSession))

  it('auto-suffixes slugs derived from duplicate titles', async () => {
    const first = await create({ title: 'Hello World' })
    const second = await create({ title: 'Hello World' })
    const third = await create({ title: 'Hello World' })

    expect(first.slug).toBe('hello-world')
    expect(second.slug).toBe('hello-world-2')
    expect(third.slug).toBe('hello-world-3')
  })

  it('auto-suffixes an explicitly provided duplicate slug', async () => {
    await create({ title: 'First', slug: 'shared-slug' })
    const second = await create({ title: 'Second', slug: 'shared-slug' })

    expect(second.slug).toBe('shared-slug-2')
  })
})
