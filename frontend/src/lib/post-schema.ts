import { z } from 'zod'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Validation for the admin post form. Mirrors the backend post fields, adapted for form state. */
export const postFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .regex(slugPattern, 'Use lowercase letters, numbers, and hyphens'),
  excerpt: z.string().trim(),
  content: z.string(),
  status: z.enum(['draft', 'published']),
  categoryId: z.string(),
  tags: z.array(z.string()),
})

export type PostFormValues = z.infer<typeof postFormSchema>

/** Map validated form state to the create/update endpoints' body (categoryId '' → null). */
export function toPostPayload(values: PostFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    content: values.content,
    excerpt: values.excerpt,
    status: values.status,
    categoryId: values.categoryId || null,
    tags: values.tags,
  }
}
