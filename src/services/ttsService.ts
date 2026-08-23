/**
 * ttsService — Client-side audio synthesis service
 *
 * Provides a single `getAudioUrl(text, staticPath)` function that returns
 * a playable audio URL using a three-tier waterfall:
 *
 *   1. Pre-rendered static MP3 (instant, offline-capable)
 *   2. Browser cache (previously synthesized via Edge Function)
 *   3. Live Edge Function synthesis (then cached for next time)
 *
 * If all tiers fail, returns null and the caller falls back to
 * browser SpeechSynthesis via useVoiceReadout.
 */

import { appConfig } from '../config/env.ts'

const CACHE_NAME = 'hapag-tts-v1'
const TTS_ENDPOINT = appConfig.supabaseFunctionUrl
  ? `${appConfig.supabaseFunctionUrl}/text-to-speech`
  : ''

/** Check whether a static MP3 file exists at the given path. */
async function staticFileExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: 'HEAD' })
    return response.ok && (response.headers.get('content-type')?.includes('audio') ?? false)
  } catch {
    return false
  }
}

/** Derive a stable cache key from the spoken text. */
function cacheKey(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
  }
  return `/tts-cache/${(hash >>> 0).toString(36)}-${text.length}`
}

/**
 * Resolve a playable audio URL for the given cooking step text.
 *
 * @param text       The full spoken text for the step
 * @param staticPath Optional path to a pre-rendered static MP3
 * @returns A blob: or path URL ready for `new Audio(url)`, or null
 */
export async function getAudioUrl(text: string, staticPath?: string): Promise<string | null> {
  // Tier 1: Pre-rendered static MP3
  if (staticPath) {
    const exists = await staticFileExists(staticPath)
    if (exists) return staticPath
  }

  const key = cacheKey(text)

  // Tier 2: Browser Cache API
  try {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(key)
    if (cached) {
      const blob = await cached.blob()
      return URL.createObjectURL(blob)
    }
  } catch {
    // Cache API unavailable — continue
  }

  // Tier 3: Live Edge Function synthesis
  if (!TTS_ENDPOINT) return null

  try {
    const response = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: appConfig.supabaseAnonKey,
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) return null

    const blob = await response.blob()

    // Cache for next time
    try {
      const cache = await caches.open(CACHE_NAME)
      await cache.put(key, new Response(blob.slice(0), {
        headers: { 'Content-Type': 'audio/mpeg' },
      }))
    } catch {
      // Cache write failed — still usable this time
    }

    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}
