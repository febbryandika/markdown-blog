import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    // Mirror the app's relative imports so `vi.mock('@/db')` intercepts the
    // routers' `../../db` import (mocks match by resolved path).
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    // Dummy values so `src/lib/env.ts` parses if anything pulls it in. Tests
    // never hit a real database — `@/db` is mocked to PGlite.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      BETTER_AUTH_SECRET: 'test-secret',
      BETTER_AUTH_URL: 'http://localhost:3000',
      FRONTEND_URL: 'http://localhost:5173',
    },
  },
})
