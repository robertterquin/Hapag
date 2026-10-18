import { useSyncExternalStore } from 'react'

// The on-screen keyboard shrinks the visual viewport; treat a large shrink as "keyboard open".
const KEYBOARD_THRESHOLD_PX = 150

function subscribe(onChange: () => void) {
  const viewport = window.visualViewport
  if (!viewport) return () => undefined
  viewport.addEventListener('resize', onChange)
  return () => viewport.removeEventListener('resize', onChange)
}

function getSnapshot() {
  const viewport = window.visualViewport
  if (!viewport) return false
  return window.innerHeight - viewport.height > KEYBOARD_THRESHOLD_PX
}

export function useKeyboardOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
