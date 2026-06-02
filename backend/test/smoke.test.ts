import { describe, it, expect } from 'vitest'
import { testDb } from './utils/db'
import { posts } from '../src/db/schema'

// Proves the runner + in-memory DB harness work end-to-end under Bun.
describe('backend test environment', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })

  it('has a migrated, empty in-memory database', async () => {
    const rows = await testDb.select().from(posts)
    expect(rows).toEqual([])
  })
})
