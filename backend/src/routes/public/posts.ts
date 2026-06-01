import { Hono } from 'hono'
import { and, asc, count, desc, eq, gt, isNotNull, lt, sql } from 'drizzle-orm'
import { db } from '../../db'
import { posts } from '../../db/schema'
import { ApiError } from '../../lib/errors'
import { markdownToHtml } from '../../lib/markdown'
import { validate } from '../../lib/validate'
import { paginationQuerySchema } from '../../validation'

const PAGE_SIZE = 10

// Summary columns — excludes raw content to keep list responses lean
const summaryColumns = {
  id: posts.id,
  title: posts.title,
  slug: posts.slug,
  excerpt: posts.excerpt,
  coverImage: posts.coverImage,
  status: posts.status,
  readingTime: posts.readingTime,
  categoryId: posts.categoryId,
  tags: posts.tags,
  publishedAt: posts.publishedAt,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
}

export const publicPostsRouter = new Hono()
  // GET /api/posts?page=1&tag=typescript
  .get('/', validate('query', paginationQuerySchema), async (c) => {
    const { page, tag } = c.req.valid('query')

    const whereClause = and(
      eq(posts.status, 'published'),
      tag ? sql`${tag} = ANY(${posts.tags})` : undefined
    )

    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select(summaryColumns)
        .from(posts)
        .where(whereClause)
        .orderBy(desc(posts.publishedAt))
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
      db.select({ value: count() }).from(posts).where(whereClause),
    ])

    return c.json({
      posts: rows,
      page,
      pageSize: PAGE_SIZE,
      total: Number(total),
      totalPages: Math.ceil(Number(total) / PAGE_SIZE),
    })
  })

  // GET /api/posts/:slug
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug')

    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, 'published')))
      .limit(1)

    if (!post) throw ApiError.notFound('Post not found')

    const [html, [prev], [next]] = await Promise.all([
      markdownToHtml(post.content),
      // prev: most recent published post before this one
      post.publishedAt
        ? db
            .select({ title: posts.title, slug: posts.slug })
            .from(posts)
            .where(
              and(
                eq(posts.status, 'published'),
                isNotNull(posts.publishedAt),
                lt(posts.publishedAt, post.publishedAt)
              )
            )
            .orderBy(desc(posts.publishedAt))
            .limit(1)
        : Promise.resolve([undefined]),
      // next: earliest published post after this one
      post.publishedAt
        ? db
            .select({ title: posts.title, slug: posts.slug })
            .from(posts)
            .where(
              and(
                eq(posts.status, 'published'),
                isNotNull(posts.publishedAt),
                gt(posts.publishedAt, post.publishedAt)
              )
            )
            .orderBy(asc(posts.publishedAt))
            .limit(1)
        : Promise.resolve([undefined]),
    ])

    return c.json({
      ...post,
      html,
      prev: prev ?? null,
      next: next ?? null,
    })
  })
