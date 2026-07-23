export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function getRateLimitConfig(env: (name: string) => string | undefined) {
  return {
    anonymousLimit: positiveInteger(env('AI_ANONYMOUS_LIMIT'), 3),
    windowSeconds: positiveInteger(env('AI_RATE_WINDOW_SECONDS'), 3600),
  }
}

export async function consumeRateLimit(key: string, limit: number, windowSeconds: number, env: (name: string) => string | undefined): Promise<RateLimitResult> {
  const url = env('UPSTASH_REDIS_REST_URL')?.replace(/\/$/, '')
  const token = env('UPSTASH_REDIS_REST_TOKEN')
  if (!url || !token) throw new Error('Upstash rate limiting is not configured.')

  const headers = { Authorization: `Bearer ${token}` }
  const encodedKey = encodeURIComponent(key)
  const incrementResponse = await fetch(`${url}/incr/${encodedKey}`, { headers })
  if (!incrementResponse.ok) throw new Error(`Upstash increment failed with status ${incrementResponse.status}.`)
  const incrementPayload = await incrementResponse.json() as { result?: unknown }
  const count = Number(incrementPayload.result)
  if (!Number.isFinite(count)) throw new Error('Upstash returned an invalid counter.')

  if (count === 1) {
    const expireResponse = await fetch(`${url}/expire/${encodedKey}/${windowSeconds}`, { headers })
    if (!expireResponse.ok) throw new Error(`Upstash expiry failed with status ${expireResponse.status}.`)
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: windowSeconds,
  }
}
