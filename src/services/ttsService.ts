

const CACHE_NAME = 'hapag-tts-v1'
const TTS_ENDPOINT = '/api/text-to-speech'

async function staticFileExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: 'HEAD' })
    return response.ok && (response.headers.get('content-type')?.includes('audio') ?? false)
  } catch {
    return false
  }
}

function cacheKey(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
  }
  return `/tts-cache/${(hash >>> 0).toString(36)}-${text.length}`
}

export async function getAudioUrl(text: string, staticPath?: string): Promise<string | null> {

  if (staticPath) {
    const exists = await staticFileExists(staticPath)
    if (exists) return staticPath
  }

  const key = cacheKey(text)

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

  try {
    const response = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) return null

    const blob = await response.blob()

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
