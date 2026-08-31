import { useCallback, useEffect, useState, useRef } from 'react'
import { getAudioUrl } from '../services/ttsService.ts'

export interface VoiceReadoutState {
  isSupported: boolean
  isSpeaking: boolean
  speak: (text: string, staticAudioPath?: string) => void
  stop: () => void
  toggle: (text: string, staticAudioPath?: string) => void
}

const TAGALOG_MARKERS =
  /\b(ang|ng|mga|sa|para|igisa|ilagay|haluin|lutuin|pakuluan|ihalo|patatas|sibuyas|bawang|manok|baboy|isda|sabaw|kutsara|minuto|hakbang|gawin|meron|kulang|pamalit|mantika|kamatis)\b/gi

function detectLanguage(text: string): 'tl-PH' | 'en-US' {
  const matches = text.match(TAGALOG_MARKERS)
  return matches && matches.length >= 1 ? 'tl-PH' : 'en-US'
}

function selectBestVoice(voices: SpeechSynthesisVoice[], lang: 'tl-PH' | 'en-US'): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null

  if (lang === 'tl-PH') {
    const filipino = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('fil') ||
        v.lang.toLowerCase().startsWith('tl') ||
        v.name.toLowerCase().includes('filipino') ||
        v.name.toLowerCase().includes('tagalog')
    )
    if (filipino) return filipino

    const phEnglish = voices.find(
      (v) => v.lang.toLowerCase().includes('ph') || v.name.toLowerCase().includes('philippines')
    )
    if (phEnglish) return phEnglish
  }

  const natural = voices.find(
    (v) =>
      (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('google')) &&
      v.lang.toLowerCase().startsWith('en')
  )
  if (natural) return natural

  const english = voices.find((v) => v.lang.toLowerCase().startsWith('en'))
  return english ?? voices[0] ?? null
}

export function useVoiceReadout(): VoiceReadoutState {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const pendingRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [])

  const stop = useCallback(() => {
    pendingRef.current++
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    utteranceRef.current = null
    setIsSpeaking(false)
  }, [])

  const speakWithSynthesis = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const lang = detectLanguage(text)
    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    const available = voices.length > 0 ? voices : window.speechSynthesis.getVoices()
    const best = selectBestVoice(available, lang)
    if (best) {
      utterance.voice = best
      utterance.lang = best.lang
    } else {
      utterance.lang = lang
    }

    utterance.rate = 0.88
    utterance.pitch = 1.0
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [voices])

  const speak = useCallback((text: string, staticAudioPath?: string) => {
    stop()
    const requestId = ++pendingRef.current

    void (async () => {
      const url = await getAudioUrl(text, staticAudioPath)

      if (requestId !== pendingRef.current) return

      if (!url) {
        speakWithSynthesis(text)
        return
      }

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
          audioRef.current = null
          speakWithSynthesis(text)
        }
      }

      audio.play().catch(() => {
        if (requestId === pendingRef.current) {
          audioRef.current = null
          speakWithSynthesis(text)
        }
      })
    })()
  }, [stop, speakWithSynthesis])

  const toggle = useCallback((text: string, staticAudioPath?: string) => {
    if (isSpeaking) {
      stop()
    } else {
      speak(text, staticAudioPath)
    }
  }, [isSpeaking, speak, stop])

  useEffect(() => {
    return () => { stop() }
  }, [stop])

  return { isSupported: true, isSpeaking, speak, stop, toggle }
}
