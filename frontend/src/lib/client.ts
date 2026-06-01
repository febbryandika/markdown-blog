import { hc } from 'hono/client'
import type { AppType } from '../../../backend/src/index'
import { env } from './env'

// Hono RPC client — fully type-safe
// AppType is inferred from the backend router
export const client = hc<AppType>(env.VITE_API_URL)
