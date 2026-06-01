import { z } from 'zod'
import { slugSchema } from './common'

export const postStatusSchema = z.enum(['draft', 'published'])

/** Body for creating a post (slug auto-generated from title when omitted). */
export const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: slugSchema.optional(),
  content: z.string().default(''),
  excerpt: z.string().trim().optional(),
  coverImage: z.string().url().optional(),
  status: postStatusSchema.default('draft'),
  categoryId: z.string().min(1).nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  publishedAt: z.coerce.date().optional(),
})

/** Body for updating a post — every field optional. */
export const updatePostSchema = createPostSchema.partial()

/** Body for the Markdown preview endpoint. */
export const previewSchema = z.object({
  content: z.string(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type PreviewInput = z.infer<typeof previewSchema>
export type PostStatus = z.infer<typeof postStatusSchema>
