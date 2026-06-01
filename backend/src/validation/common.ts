import { z } from 'zod'

/** Lowercase, hyphen-separated slug (e.g. "my-first-post"). */
export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, hyphen-separated')

/** Derive a slug from a title: lowercase, non-alphanumerics → hyphens, trimmed. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Query params for paginated public post listings (`?page=&tag=`). */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  tag: z.string().trim().min(1).optional(),
})

/** Route param carrying a record id. */
export const idParamSchema = z.object({
  id: z.string().min(1),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>
