import { useCallback, useEffect, useState, useRef } from "react"

export interface VoiceReadoutState {
  isSupported: boolean
  isSpeaking: boolean
  speak: (text: string) => void
  stop: () => void
  toggle: (text: string) => void
}

export function useVoiceReadout(): VoiceReadoutState {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true)
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Look for Filipino or clear local voice
    const voices = window.speechSynthesis.getVoices()
    const filipinoVoice = voices.find(
      (v) => v.lang.startsWith("fil") || v.lang.startsWith("tl") || v.lang.includes("PH")
    )
    if (filipinoVoice) {
      utterance.voice = filipinoVoice
      utterance.lang = filipinoVoice.lang
    } else {
      utterance.lang = "tl-PH"
    }

    utterance.rate = 0.95 // Relaxed pacing for kitchen instructions
    utterance.pitch = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

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
