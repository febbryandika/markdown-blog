import { z } from 'zod'
import { slugSchema } from './common'

/** Body for creating a category (slug auto-generated from name when omitted). */
export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  slug: slugSchema.optional(),
})

/** Body for updating a category — every field optional. */
export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
