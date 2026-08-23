/**
 * text-to-speech — Supabase Edge Function
 *
 * Synthesizes Filipino cooking instructions into MP3 audio using
 * Microsoft Edge's free neural TTS WebSocket endpoint.
 *
 * Voice: fil-PH-BlessicaNeural (same as pre-rendered studio clips)
 * Rate:  -4% (comfortable kitchen listening pace)
 */

const TRUSTED_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'
const VOICE = 'fil-PH-BlessicaNeural'
const RATE = '-4%'
const PITCH = '+0Hz'
const OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3'

const WS_BASE =
  `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}&ConnectionId=`

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function connectionId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

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

function isoNow(): string {
  return new Date().toISOString()
}

/**
 * Extract audio bytes from a binary WebSocket frame.
 * The frame has text headers followed by the audio payload.
 * The header section ends after "Path:audio\r\n".
 */
function extractAudioFromBinary(data: Uint8Array): Uint8Array | null {
  const headerTag = new TextEncoder().encode('Path:audio\r\n')

  for (let i = 0; i <= data.length - headerTag.length; i++) {
    let match = true
    for (let j = 0; j < headerTag.length; j++) {
      if (data[i + j] !== headerTag[j]) {
        match = false
        break
      }
    }
    if (match) {
      const audioStart = i + headerTag.length
      if (audioStart < data.length) {
        return data.slice(audioStart)
      }
      return null
    }
  }
  return null
}

/**
 * Convert various binary message types to Uint8Array.
 * Deno Deploy WebSocket may deliver binary data as Blob or ArrayBuffer.
 */
async function toUint8Array(data: unknown): Promise<Uint8Array | null> {
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data)
  }
  if (data instanceof Uint8Array) {
    return data
  }
  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    const buffer = await data.arrayBuffer()
    return new Uint8Array(buffer)
  }
  return null
}

async function synthesize(text: string): Promise<Uint8Array> {
  const connId = connectionId()

  return new Promise<Uint8Array>((resolve, reject) => {
    const ws = new WebSocket(`${WS_BASE}${connId}`)
    ws.binaryType = 'arraybuffer'

    const chunks: Uint8Array[] = []
    let totalLength = 0

    const timeout = setTimeout(() => {
      try { ws.close() } catch { /* ignore */ }
      reject(new Error('TTS synthesis timed out after 30s'))
    }, 30_000)

    ws.addEventListener('open', () => {
      // 1. Send audio output configuration
      ws.send(
        `Content-Type:application/json; charset=utf-8\r\n` +
        `Path:speech.config\r\n\r\n` +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: {
                  sentenceBoundaryEnabled: 'false',
                  wordBoundaryEnabled: 'false',
                },
                outputFormat: OUTPUT_FORMAT,
              },
            },
          },
        })
      )

      // 2. Send SSML synthesis request
      ws.send(
        `X-RequestId:${connId}\r\n` +
        `Content-Type:application/ssml+xml\r\n` +
        `X-Timestamp:${isoNow()}\r\n` +
        `Path:ssml\r\n\r\n` +
        buildSsml(text)
      )
    })

    ws.addEventListener('message', async (event: MessageEvent) => {
      const { data } = event

      if (typeof data === 'string') {
        // Text frame — check for synthesis completion
        if (data.includes('Path:turn.end')) {
          clearTimeout(timeout)
          try { ws.close() } catch { /* ignore */ }

          const result = new Uint8Array(totalLength)
          let offset = 0
          for (const chunk of chunks) {
            result.set(chunk, offset)
            offset += chunk.length
          }
          resolve(result)
        }
        return
      }

      // Binary frame — extract audio payload
      const binary = await toUint8Array(data)
      if (!binary) return

      const audio = extractAudioFromBinary(binary)
      if (audio && audio.length > 0) {
        chunks.push(audio)
        totalLength += audio.length
      }
    })

    ws.addEventListener('error', (event) => {
      clearTimeout(timeout)
      const msg = event instanceof ErrorEvent ? event.message : 'WebSocket connection failed'
      reject(new Error(msg))
    })

    ws.addEventListener('close', (event) => {
      clearTimeout(timeout)
      if (chunks.length === 0) {
        reject(new Error(`WebSocket closed with code ${event.code} before receiving audio`))
      }
    })
  })
}

// deno-lint-ignore no-explicit-any
(Deno as any).serve(async (req: Request) => {
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

    if (audio.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Synthesis returned empty audio' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
    const message = error instanceof Error ? error.message : String(error)
    console.error('[TTS] Synthesis failed:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
