import { Hono } from 'hono'
import RSS from 'rss'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { posts } from '../../db/schema'
import { env } from '../../lib/env'

export const feedRouter = new Hono().get('/', async (c) => {
  const rows = await db
    .select({
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
    .limit(20)

  const siteUrl = env.FRONTEND_URL
  const feed = new RSS({
    title: 'My Dev Blog',
    feed_url: `${siteUrl}/feed`,
    site_url: siteUrl,
  })

  for (const post of rows) {
    feed.item({
      title: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      date: post.publishedAt!,
      description: post.excerpt ?? '',
    })
  }

  return c.body(feed.xml(), 200, { 'Content-Type': 'application/rss+xml' })
})
