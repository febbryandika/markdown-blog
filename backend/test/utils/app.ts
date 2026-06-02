import { Hono } from 'hono'
import { handleError, notFoundHandler } from '@/lib/errors'

/**
 * Mount `router` under `basePath` with the same error wiring as production
 * (`handleError` + `notFound`), so thrown `ApiError`s serialize to the
 * structured `{ error: { code, message } }` body.
 */
export function makeApp(
  basePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: Hono<any, any, any>,
) {
  return new Hono()
    .route(basePath, router)
    .onError(handleError)
    .notFound(notFoundHandler)
}

/** Make a request against an app, JSON-encoding the body when present. */
export function req(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: Hono<any, any, any>,
  method: string,
  path: string,
  body?: unknown,
) {
  return app.request(path, {
    method,
    headers:
      body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}
