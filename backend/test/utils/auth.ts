export type FakeSession = { user: unknown; session: unknown } | null

/**
 * Mutable holder the mocked `auth.getSession` reads from. `test/setup.ts` wires
 * the mock against this ref; tests drive it via `setSession`.
 */
export const sessionRef: { current: FakeSession } = { current: null }

/** Set the session the mocked auth returns for the current test. */
export function setSession(session: FakeSession) {
  sessionRef.current = session
}

/** A minimal authenticated session for admin-route tests. */
export const fakeSession: FakeSession = {
  user: { id: 'test-user', email: 'admin@example.com' },
  session: { id: 'test-session' },
}
