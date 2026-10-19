import { useCallback, useEffect, useState } from 'react'

export interface VoiceReadoutState {
  isSupported: boolean
  isSpeaking: boolean
  speak: (text: string) => void
  stop: () => void
  toggle: (text: string) => void
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

// Reads steps aloud with the device's built-in speech voices; no server or third-party service.
export function useVoiceReadout(): VoiceReadoutState {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (!isSupported) return undefined
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  const speak = useCallback((text: string) => {
    if (!isSupported) return

    window.speechSynthesis.cancel()
    const lang = detectLanguage(text)
    const utterance = new SpeechSynthesisUtterance(text)

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
  }, [isSupported, voices])

  const toggle = useCallback((text: string) => {
    if (isSpeaking) {
      stop()
    } else {
      speak(text)
    }
  }, [isSpeaking, speak, stop])

  useEffect(() => {
    return () => { stop() }
  }, [stop])

  return { isSupported, isSpeaking, speak, stop, toggle }
}
