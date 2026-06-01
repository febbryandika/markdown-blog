import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { ZodError } from 'zod'

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

/** Structured API error body — SPEC §11. */
export interface ErrorBody {
  error: {
    code: ErrorCode
    message: string
  }
}

/** Throwable error that route handlers can raise; serialized by `handleError`. */
export class ApiError extends Error {
  constructor(
    readonly status: ContentfulStatusCode,
    readonly code: ErrorCode,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static badRequest(message: string) {
    return new ApiError(400, ErrorCode.VALIDATION_ERROR, message)
  }
  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, ErrorCode.UNAUTHORIZED, message)
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, ErrorCode.NOT_FOUND, message)
  }
  static conflict(message: string) {
    return new ApiError(409, ErrorCode.CONFLICT, message)
  }
}

/** Build a structured JSON error response. */
export function errorResponse(
  c: Context,
  status: ContentfulStatusCode,
  code: ErrorCode,
  message: string
) {
  const body: ErrorBody = { error: { code, message } }
  return c.json(body, status)
}

/** Global `app.onError` handler — normalizes everything to the structured shape. */
export function handleError(err: Error, c: Context) {
  if (err instanceof ApiError) {
    return errorResponse(c, err.status, err.code, err.message)
  }

  if (err instanceof ZodError) {
    const first = err.issues[0]
    return errorResponse(c, 400, ErrorCode.VALIDATION_ERROR, first?.message ?? 'Invalid request')
  }

  if (err instanceof HTTPException) {
    const code =
      err.status === 401 || err.status === 403
        ? ErrorCode.UNAUTHORIZED
        : err.status === 404
          ? ErrorCode.NOT_FOUND
          : err.status === 409
            ? ErrorCode.CONFLICT
            : err.status >= 500
              ? ErrorCode.INTERNAL_ERROR
              : ErrorCode.VALIDATION_ERROR
    return errorResponse(c, err.status, code, err.message)
  }

  console.error('Unhandled error:', err)
  return errorResponse(c, 500, ErrorCode.INTERNAL_ERROR, 'Internal server error')
}

/** Global `app.notFound` handler. */
export function notFoundHandler(c: Context) {
  return errorResponse(c, 404, ErrorCode.NOT_FOUND, 'Resource not found')
}
