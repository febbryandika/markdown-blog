import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:3000'),
})

const parsed = envSchema.safeParse(import.meta.env)
if (!parsed.success) {
  console.error('❌ Invalid frontend environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const env = parsed.data
