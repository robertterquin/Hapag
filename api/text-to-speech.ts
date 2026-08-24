import type { VercelRequest, VercelResponse } from '@vercel/node'
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'

const VOICE = 'en-PH-RosaNeural'
const MAX_TEXT_LENGTH = 2000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''

  if (!text) return res.status(400).json({ error: 'Missing "text" field' })
  if (text.length > MAX_TEXT_LENGTH) return res.status(400).json({ error: `Text exceeds ${MAX_TEXT_LENGTH} character limit` })

  try {
    const tts = new MsEdgeTTS()
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)

    const { audioStream } = tts.toStream(text, { rate: 0.96, pitch: '+0Hz' })

    const chunks: Buffer[] = []
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk))
    }
    const audio = Buffer.concat(chunks)

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', String(audio.length))
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
    return res.status(200).send(audio)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Synthesis failed'
    console.error('[TTS]', message)
    return res.status(502).json({ error: message })
  }
}
