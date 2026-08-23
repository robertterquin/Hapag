import { useCallback, useEffect, useState, useRef } from 'react'
import { getAudioUrl } from '../services/ttsService.ts'

export interface VoiceReadoutState {
  isSupported: boolean
  isSpeaking: boolean
  speak: (text: string, staticAudioPath?: string) => void
  stop: () => void
  toggle: (text: string, staticAudioPath?: string) => void
}

/**
 * React hook for cooking step voice readout.
 *
 * Uses a unified audio pipeline: every step is played through the same
 * fil-PH-BlessicaNeural neural voice, whether pre-rendered or synthesized
 * on demand via the Edge Function.
 */
export function useVoiceReadout(): VoiceReadoutState {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const pendingRef = useRef(0)

  const stop = useCallback(() => {
    pendingRef.current++
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsSpeaking(false)
  }, [])

  const speak = useCallback((text: string, staticAudioPath?: string) => {
    stop()
    const requestId = ++pendingRef.current

    void (async () => {
      const url = await getAudioUrl(text, staticAudioPath)

      // If a newer request was made while we were resolving, bail
      if (requestId !== pendingRef.current) return

      if (!url) return

      const audio = new Audio(url)
      audioRef.current = audio

      audio.onplay = () => {
        if (requestId === pendingRef.current) setIsSpeaking(true)
      }
      audio.onended = () => {
        if (requestId === pendingRef.current) {
          setIsSpeaking(false)
          audioRef.current = null
        }
      }
      audio.onerror = () => {
        if (requestId === pendingRef.current) {
          setIsSpeaking(false)
          audioRef.current = null
        }
      }

      audio.play().catch(() => {
        if (requestId === pendingRef.current) {
          setIsSpeaking(false)
          audioRef.current = null
        }
      })
    })()
  }, [stop])

  const toggle = useCallback((text: string, staticAudioPath?: string) => {
    if (isSpeaking) {
      stop()
    } else {
      speak(text, staticAudioPath)
    }
  }, [isSpeaking, speak, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => { stop() }
  }, [stop])

  return { isSupported: true, isSpeaking, speak, stop, toggle }
}
