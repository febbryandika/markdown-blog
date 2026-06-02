import { zValidator } from '@hono/zod-validator'
import type { ValidationTargets } from 'hono'
import type { ZodSchema } from 'zod'
import { errorResponse, ErrorCode } from './errors'

/**
 * Request validator that returns structured `VALIDATION_ERROR` responses on
 * failure. Drop-in replacement for `zValidator`; routes get typed
 * `c.req.valid(target)` access. Example: `validate('json', createPostSchema)`.
 */
export function validate<
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(target: Target, schema: T) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const first = result.error.issues[0]
      const path = first?.path.join('.')
      const message = first
        ? path
          ? `${path}: ${first.message}`
          : first.message
        : 'Invalid request'
      return errorResponse(c, 400, ErrorCode.VALIDATION_ERROR, message)
    }
  })
}
