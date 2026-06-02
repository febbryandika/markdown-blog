import { describe, it, expect, beforeEach } from 'vitest'
import { adminPostsRouter } from '@/routes/admin/posts'
import { makeApp, req, buildPostInput, setSession, fakeSession } from './utils'

const base = '/api/admin/posts'
const app = makeApp(base, adminPostsRouter)

describe('admin posts CRUD', () => {
  beforeEach(() => setSession(fakeSession))

  it('creates, reads, updates, and deletes a post', async () => {
    // Create
    const createRes = await req(
      app,
      'POST',
      base,
      buildPostInput({ title: 'My First Post', status: 'published' }),
    )
    expect(createRes.status).toBe(201)
    const created = await createRes.json()
    expect(created).toMatchObject({
      title: 'My First Post',
      slug: 'my-first-post',
      status: 'published',
    })
    expect(created.id).toBeTruthy()
    expect(created.readingTime).toBe(1)
    expect(created.publishedAt).toBeTruthy() // published posts get a publishedAt
    const { id } = created

    // List
    const listRes = await req(app, 'GET', base)
    expect(listRes.status).toBe(200)
    const list = await listRes.json()
    expect(list).toHaveLength(1)
    expect(list[0].id).toBe(id)

    // Read one
    const getRes = await req(app, 'GET', `${base}/${id}`)
    expect(getRes.status).toBe(200)
    expect((await getRes.json()).id).toBe(id)

    // Update — slug re-derives from the new title
    const updateRes = await req(app, 'PUT', `${base}/${id}`, {
      title: 'Updated Title',
    })
    expect(updateRes.status).toBe(200)
    const updated = await updateRes.json()
    expect(updated.title).toBe('Updated Title')
    expect(updated.slug).toBe('updated-title')

    // Delete (hard delete)
    const deleteRes = await req(app, 'DELETE', `${base}/${id}`)
    expect(deleteRes.status).toBe(200)
    expect(await deleteRes.json()).toEqual({ success: true })

    // Gone
    const goneRes = await req(app, 'GET', `${base}/${id}`)
    expect(goneRes.status).toBe(404)
    expect((await goneRes.json()).error.code).toBe('NOT_FOUND')
  })
})
