import { beforeAll, beforeEach, vi } from 'vitest'
import { setupTestDb, resetDb } from './utils/db'

/**
 * Global test wiring (applied to every backend test file via `setupFiles`).
 *
 * Only the two external boundaries are mocked:
 *  - `@/db`        → the in-memory PGlite instance (real SQL, no Neon).
 *  - `@/lib/auth`  → a fake `getSession`; the only dependency of `requireAuth`.
 * Everything else (routers, middleware, validation, markdown, error handling)
 * runs for real, so these stay true integration tests.
 */

vi.mock('@/db', async () => ({ db: (await import('./utils/db')).testDb }))

type FakeSession = { user: unknown; session: unknown } | null

// Hoisted so the mock factory below can reference it (vi.mock is hoisted too).
const mocks = vi.hoisted(() => ({ session: null as FakeSession }))

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn(async () => mocks.session) } },
}))

/** Set the session the mocked auth returns for the current test. */
export function setSession(session: FakeSession) {
  mocks.session = session
}

/** A minimal authenticated session for admin-route tests. */
export const fakeSession: FakeSession = {
  user: { id: 'test-user', email: 'admin@example.com' },
  session: { id: 'test-session' },
}

beforeAll(async () => {
  await setupTestDb()
})

beforeEach(async () => {
  mocks.session = null
  await resetDb()
})
