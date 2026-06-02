import { Hono } from 'hono'
import { asc } from 'drizzle-orm'
import { db } from '../../db'
import { categories } from '../../db/schema'
import { requireAuth } from '../../lib/middleware'

export const adminCategoriesRouter = new Hono()
  .use('*', requireAuth)

  // List all categories
  .get('/', async (c) => {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.name))
    return c.json(rows)
  })
