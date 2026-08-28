import { useEffect, useState, useCallback, useRef } from "react"

export interface WakeLockState {
  isSupported: boolean
  isLocked: boolean
  request: () => Promise<void>
  release: () => Promise<void>
}

export function useWakeLock(): WakeLockState {
  const [isLocked, setIsLocked] = useState(false)
  const [isSupported] = useState(() => typeof window !== 'undefined' && 'wakeLock' in navigator)
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
    let isMounted = true
    if (!isSupported) return undefined

    const acquire = async () => {
      if (typeof window === "undefined" || !("wakeLock" in navigator)) return
      try {
        if (sentinelRef.current && !sentinelRef.current.released) return
        const sentinel = await navigator.wakeLock.request("screen")
        if (isMounted) {
          sentinelRef.current = sentinel
          setIsLocked(true)
        }
        sentinel.addEventListener("release", () => {
          sentinelRef.current = null
          if (isMounted) setIsLocked(false)
        })
      } catch {
        if (isMounted) setIsLocked(false)
      }
    }

    void acquire()

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void acquire()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      isMounted = false
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      void release()
    }
  }, [isSupported, release])

  return { isSupported, isLocked, request, release }
}
