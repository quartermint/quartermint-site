import { Redis } from '@upstash/redis'

// Environment variables auto-populated by Vercel Marketplace integration:
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv()
