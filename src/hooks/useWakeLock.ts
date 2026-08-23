import { useEffect, useState, useCallback, useRef } from "react"

export interface WakeLockState {
  isSupported: boolean
  isLocked: boolean
  request: () => Promise<void>
  release: () => Promise<void>
}

export function useWakeLock(): WakeLockState {
  const [isLocked, setIsLocked] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  const request = useCallback(async () => {
    if (typeof window === "undefined" || !("wakeLock" in navigator)) return
    try {
      if (sentinelRef.current && !sentinelRef.current.released) return
      const sentinel = await navigator.wakeLock.request("screen")
      sentinelRef.current = sentinel
      setIsLocked(true)

      sentinel.addEventListener("release", () => {
        sentinelRef.current = null
        setIsLocked(false)
      })
    } catch {
      // Graceful fallback if wake lock is denied or unsupported on low battery
      setIsLocked(false)
    }
  }, [])

  const release = useCallback(async () => {
    try {
      if (sentinelRef.current && !sentinelRef.current.released) {
        await sentinelRef.current.release()
        sentinelRef.current = null
        setIsLocked(false)
      }
    } catch {
      // Ignored
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && "wakeLock" in navigator) {
      setIsSupported(true)
      void request()

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          void request()
        }
      }

      document.addEventListener("visibilitychange", handleVisibilityChange)
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        void release()
      }
    }
    return undefined
  }, [request, release])

  return { isSupported, isLocked, request, release }
}
