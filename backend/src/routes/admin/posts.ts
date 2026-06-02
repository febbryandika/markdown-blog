import { Hono } from 'hono'
import { and, desc, eq, ne } from 'drizzle-orm'
import { db } from '../../db'
import { posts } from '../../db/schema'
import { ApiError } from '../../lib/errors'
import { getReadingTime } from '../../lib/reading-time'
import { requireAuth } from '../../lib/middleware'
import { validate } from '../../lib/validate'
import {
  createPostSchema,
  idParamSchema,
  slugify,
  updatePostSchema,
} from '../../validation'
import { markdownToHtml } from '../../lib/markdown'
import { previewSchema } from '../../validation'

async function generateUniqueSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  let candidate = base
  let counter = 2

  while (true) {
    const [existing] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(
        excludeId
          ? and(eq(posts.slug, candidate), ne(posts.id, excludeId))
          : eq(posts.slug, candidate),
      )
      .limit(1)

    if (!existing) return candidate
    candidate = `${base}-${counter++}`
  }
}

export const adminPostsRouter = new Hono()
  .use('*', requireAuth)

  // List all posts (any status)
  .get('/', async (c) => {
    const rows = await db.select().from(posts).orderBy(desc(posts.updatedAt))
    return c.json(rows)
  })

  // Preview markdown → HTML
  .post('/preview', validate('json', previewSchema), async (c) => {
    const { content } = c.req.valid('json')
    const html = await markdownToHtml(content)
    return c.json({ html })
  })

  // Create post
  .post('/', validate('json', createPostSchema), async (c) => {
    const input = c.req.valid('json')

    const baseSlug = input.slug ?? slugify(input.title)
    const slug = await generateUniqueSlug(baseSlug)
    const readingTimeVal = getReadingTime(input.content)

    let publishedAt = input.publishedAt ?? null
    if (input.status === 'published' && !publishedAt) {
      publishedAt = new Date()
    }

    const [post] = await db
      .insert(posts)
      .values({
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt ?? null,
        coverImage: input.coverImage ?? null,
        status: input.status,
        readingTime: readingTimeVal,
        categoryId: input.categoryId ?? null,
        tags: input.tags,
        publishedAt,
      })
      .returning()

    return c.json(post, 201)
  })

  // Get single post for editing
  .get('/:id', validate('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param')
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1)
    if (!post) throw ApiError.notFound('Post not found')
    return c.json(post)
  })

  // Update post
  .put(
    '/:id',
    validate('param', idParamSchema),
    validate('json', updatePostSchema),
    async (c) => {
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')

      const [existing] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1)
      if (!existing) throw ApiError.notFound('Post not found')

      const updates: Partial<typeof existing> = {}

      if (input.title !== undefined || input.slug !== undefined) {
        const base =
          input.slug ?? (input.title ? slugify(input.title) : existing.slug)
        updates.slug = await generateUniqueSlug(base, id)
      }

      if (input.title !== undefined) updates.title = input.title
      if (input.content !== undefined) {
        updates.content = input.content
        updates.readingTime = getReadingTime(input.content)
      }
      if (input.excerpt !== undefined) updates.excerpt = input.excerpt ?? null
      if (input.coverImage !== undefined)
        updates.coverImage = input.coverImage ?? null
      if (input.status !== undefined) updates.status = input.status
      if (input.categoryId !== undefined)
        updates.categoryId = input.categoryId ?? null
      if (input.tags !== undefined) updates.tags = input.tags

      if (input.publishedAt !== undefined) {
        updates.publishedAt = input.publishedAt ?? null
      } else if (input.status === 'published' && !existing.publishedAt) {
        updates.publishedAt = new Date()
      }

      updates.updatedAt = new Date()

      const [updated] = await db
        .update(posts)
        .set(updates)
        .where(eq(posts.id, id))
        .returning()

      return c.json(updated)
    },
  )

  // Delete post
  .delete('/:id', validate('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param')
    const [existing] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1)
    if (!existing) throw ApiError.notFound('Post not found')
    await db.delete(posts).where(eq(posts.id, id))
    return c.json({ success: true })
  })
