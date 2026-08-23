import { useCallback, useEffect, useState, useRef } from 'react'

export interface VoiceReadoutState {
  isSupported: boolean
  isSpeaking: boolean
  speak: (text: string) => void
  stop: () => void
  toggle: (text: string) => void
}

export function detectLanguage(text: string): 'tl-PH' | 'en-US' {
  const tagalogMarkers = /\b(ang|ng|mga|sa|para|igisa|ilagay|haluin|lutuin|pakuluan|ihalo|patatas|sibuyas|bawang|manok|baboy|isda|sabaw|kutsara|minuto|hakbang|gawin|meron|kulang|pamalit|mantika|kamatis)\b/gi
  const matches = text.match(tagalogMarkers)
  return matches && matches.length >= 1 ? 'tl-PH' : 'en-US'
}

export function normalizeCookingTextForSpeech(text: string, lang: 'tl-PH' | 'en-US'): string {
  let cleaned = text

  if (lang === 'tl-PH') {
    cleaned = cleaned
      .replace(/\b(\d+)\s*(min|mins|minuto|m)\b/gi, '$1 minuto')
      .replace(/\b(\d+)\s*(sec|secs|segundo|s)\b/gi, '$1 segundo')
      .replace(/\b(\d+)\s*(tbsp|tbsps|kutsara)\b/gi, '$1 kutsara')
      .replace(/\b(\d+)\s*(tsp|tsps|kutsarita)\b/gi, '$1 kutsarita')
      .replace(/\b(\d+)\s*(cup|cups|tasa)\b/gi, '$1 tasa')
      .replace(/\bapprox\.?\b/gi, 'humigit-kumulang')
      .replace(/\bmed\.?\b/gi, 'katamtaman')
      .replace(/\b1\/2\b/g, 'kalahating')
      .replace(/\b1\/4\b/g, 'isang kapat na')
      .replace(/\b3\/4\b/g, 'tatlong kapat na')
  } else {
    cleaned = cleaned
      .replace(/\b(\d+)\s*mins?\b/gi, '$1 minutes')
      .replace(/\b(\d+)\s*secs?\b/gi, '$1 seconds')
      .replace(/\b(\d+)\s*tbsps?\b/gi, '$1 tablespoons')
      .replace(/\b(\d+)\s*tsps?\b/gi, '$1 teaspoons')
      .replace(/\bapprox\.?\b/gi, 'approximately')
      .replace(/\bmed\.?\b/gi, 'medium')
      .replace(/\b1\/2\b/g, 'half a')
      .replace(/\b1\/4\b/g, 'one quarter of a')
      .replace(/\b3\/4\b/g, 'three quarters of a')
  }

  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  return cleaned
}

export function selectBestVoice(voices: SpeechSynthesisVoice[], lang: 'tl-PH' | 'en-US'): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null

  if (lang === 'tl-PH') {
    // 1. Direct Filipino / Tagalog native or neural voice
    const filipino = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('fil') ||
        v.lang.toLowerCase().startsWith('tl') ||
        v.name.toLowerCase().includes('filipino') ||
        v.name.toLowerCase().includes('tagalog') ||
        v.name.toLowerCase().includes('blessica')
    )
    if (filipino) return filipino

    // 2. Philippine English voice (natural accents for Filipino dish names)
    const phEnglish = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('ph') ||
        v.name.toLowerCase().includes('philippines') ||
        v.name.toLowerCase().includes('rosa')
    )
    if (phEnglish) return phEnglish

    // 3. High quality natural neural voice fallback
    const naturalVoice = voices.find(
      (v) =>
        (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('google')) &&
        v.lang.toLowerCase().startsWith('en')
    )
    if (naturalVoice) return naturalVoice
  } else {
    // For English: prefer Natural/Online neural voices
    const naturalEnglish = voices.find(
      (v) =>
        (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('google')) &&
        (v.lang.toLowerCase().startsWith('en-us') || v.lang.toLowerCase().startsWith('en-gb') || v.lang.toLowerCase().startsWith('en'))
    )
    if (naturalEnglish) return naturalEnglish

    const generalEnglish = voices.find((v) => v.lang.toLowerCase().startsWith('en'))
    if (generalEnglish) return generalEnglish
  }

  return voices[0] || null
}

export function useVoiceReadout(): VoiceReadoutState {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices

      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = null
        }
      }
    }
    return undefined
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const detectedLang = detectLanguage(text)
    const normalizedText = normalizeCookingTextForSpeech(text, detectedLang)

    const utterance = new SpeechSynthesisUtterance(normalizedText)
    utteranceRef.current = utterance

    const activeVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices()
    const bestVoice = selectBestVoice(activeVoices, detectedLang)

    if (bestVoice) {
      utterance.voice = bestVoice
      utterance.lang = bestVoice.lang
    } else {
      utterance.lang = detectedLang
    }

    // Calibrated rate for clear syllable separation in kitchen settings
    utterance.rate = 0.88
    utterance.pitch = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [voices])

  const toggle = useCallback((text: string) => {
    if (isSpeaking) {
      stop()
    } else {
      speak(text)
    }
  }, [isSpeaking, speak, stop])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { isSupported, isSpeaking, speak, stop, toggle }
}
