import { beforeAll, beforeEach, vi } from 'vitest'
import { setupTestDb, resetDb } from './utils/db'
import { sessionRef } from './utils/auth'

/**
 * Global test wiring (applied to every backend test file via `setupFiles`).
 *
 * Only the two external boundaries are mocked:
 *  - `@/db`        → the in-memory PGlite instance (real SQL, no Neon).
 *  - `@/lib/auth`  → a fake `getSession` backed by `sessionRef`; the only
 *                    dependency of `requireAuth`.
 * Everything else (routers, middleware, validation, markdown, error handling)
 * runs for real, so these stay true integration tests.
 */

vi.mock('@/db', async () => ({ db: (await import('./utils/db')).testDb }))

vi.mock('@/lib/auth', async () => {
  const { sessionRef } = await import('./utils/auth')
  return { auth: { api: { getSession: vi.fn(async () => sessionRef.current) } } }
})

beforeAll(async () => {
  await setupTestDb()
})

beforeEach(async () => {
  sessionRef.current = null
  await resetDb()
})
