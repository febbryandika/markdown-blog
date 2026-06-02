import type { CreatePostInput } from '@/validation'

/** A valid create-post payload; override any field per test. */
export function buildPostInput(overrides: Partial<CreatePostInput> = {}) {
  return {
    title: 'Hello World',
    content: '# Hello\n\nBody text.',
    tags: ['intro'],
    ...overrides,
  }
}
