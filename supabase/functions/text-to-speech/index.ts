/**
 * text-to-speech — Supabase Edge Function
 *
 * Synthesizes Filipino cooking instructions into MP3 audio using
 * Microsoft Edge's free neural TTS WebSocket endpoint.
 *
 * Voice: fil-PH-BlessicaNeural (same as pre-rendered studio clips)
 * Rate:  -4% (comfortable kitchen listening pace)
 *
 * POST /text-to-speech
 *   Body: { "text": "Igisa ang bawang..." }
 *   Response: audio/mpeg binary stream
 */

const TRUSTED_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'
const VOICE = 'fil-PH-BlessicaNeural'
const RATE = '-4%'
const PITCH = '+0Hz'
const OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3'

const WS_URL =
  `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}&ConnectionId=`

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

/** Generate a compact hex ID for the WebSocket connection. */
function connectionId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Build the SSML payload for a single utterance. */
function buildSsml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='fil-PH'>` +
    `<voice name='${VOICE}'>` +
    `<prosody rate='${RATE}' pitch='${PITCH}'>${escaped}</prosody>` +
    `</voice></speak>`
  )
}

/** ISO 8601 timestamp for the Edge TTS protocol header. */
function isoNow(): string {
  return new Date().toISOString()
}

/**
 * Connect to the Edge TTS WebSocket and collect MP3 audio chunks.
 * Resolves with the concatenated MP3 binary.
 */
async function synthesize(text: string): Promise<Uint8Array> {
  const connId = connectionId()
  const ws = new WebSocket(`${WS_URL}${connId}`)

  const chunks: Uint8Array[] = []
  let totalLength = 0

  return new Promise<Uint8Array>((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close()
      reject(new Error('TTS synthesis timed out'))
    }, 30_000)

    ws.onopen = () => {
      // 1. Send configuration message
      ws.send(
        `Content-Type:application/json; charset=utf-8\r\n` +
        `Path:speech.config\r\n\r\n` +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
                outputFormat: OUTPUT_FORMAT,
              },
            },
          },
        })
      )

      // 2. Send SSML synthesis request
      const requestId = connId
      ws.send(
        `X-RequestId:${requestId}\r\n` +
        `Content-Type:application/ssml+xml\r\n` +
        `X-Timestamp:${isoNow()}\r\n` +
        `Path:ssml\r\n\r\n` +
        buildSsml(text)
      )
    }

    ws.onmessage = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        // Text message — check for turn.end to know synthesis is complete
        if (event.data.includes('Path:turn.end')) {
          clearTimeout(timeout)
          ws.close()
          // Concatenate collected chunks
          const result = new Uint8Array(totalLength)
          let offset = 0
          for (const chunk of chunks) {
            result.set(chunk, offset)
            offset += chunk.length
          }
          resolve(result)
        }
      } else if (event.data instanceof ArrayBuffer) {
        // Binary message — extract audio data after the header separator
        const view = new Uint8Array(event.data)
        const headerTag = 'Path:audio\r\n'
        const headerBytes = new TextEncoder().encode(headerTag)

        // Find the end of headers (look for the audio path marker)
        let audioStart = -1
        for (let i = 0; i <= view.length - headerBytes.length; i++) {
          let found = true
          for (let j = 0; j < headerBytes.length; j++) {
            if (view[i + j] !== headerBytes[j]) {
              found = false
              break
            }
          }
          if (found) {
            audioStart = i + headerBytes.length
            break
          }
        }

        if (audioStart > 0 && audioStart < view.length) {
          const audioData = view.slice(audioStart)
          chunks.push(audioData)
          totalLength += audioData.length
        }
      }
    }

    ws.onerror = (err) => {
      clearTimeout(timeout)
      reject(err)
    }

    ws.onclose = (event) => {
      clearTimeout(timeout)
      if (chunks.length === 0 && event.code !== 1000) {
        reject(new Error(`WebSocket closed unexpectedly: ${event.code}`))
      }
    }
  })
}

// deno-lint-ignore no-explicit-any
Deno.serve(async (req: any) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await req.json()
    const text = typeof body?.text === 'string' ? body.text.trim() : ''

    if (!text || text.length > 2000) {
      return new Response(
        JSON.stringify({ error: text ? 'Text exceeds 2000 character limit' : 'Missing "text" field' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const audio = await synthesize(text)

    return new Response(audio, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800, immutable',
        'Content-Length': String(audio.byteLength),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal synthesis error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
