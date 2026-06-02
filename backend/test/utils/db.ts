import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { fileURLToPath } from 'node:url'
import * as schema from '../../src/db/schema'

/**
 * In-memory Postgres for integration tests. A fresh instance is created per
 * test file (Vitest isolates module state), so files don't share data.
 */
const client = new PGlite()
export const testDb = drizzle(client, { schema })

const migrationsFolder = fileURLToPath(new URL('../../drizzle', import.meta.url))

/** Build the schema by replaying the real drizzle migration. Run once per file. */
export async function setupTestDb() {
  await migrate(testDb, { migrationsFolder })
}

/** Wipe app tables between tests so each test starts from a clean slate. */
export async function resetDb() {
  await client.exec('TRUNCATE posts, categories CASCADE')
}
