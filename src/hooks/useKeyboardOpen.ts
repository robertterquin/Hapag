import { useSyncExternalStore } from 'react'

// The on-screen keyboard shrinks the visual viewport. Pinch-zoom shrinks it too, so a shrink
// only counts as "keyboard open" while a text field has focus.
const KEYBOARD_THRESHOLD_PX = 150

function isEditable(element: Element | null) {
  if (!(element instanceof HTMLElement)) return false
  if (element.isContentEditable || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return true
  return element instanceof HTMLInputElement && !['button', 'checkbox', 'radio', 'range', 'submit', 'reset', 'file', 'color'].includes(element.type)
}

function subscribe(onChange: () => void) {
  const viewport = window.visualViewport
  viewport?.addEventListener('resize', onChange)
  document.addEventListener('focusin', onChange)
  document.addEventListener('focusout', onChange)
  return () => {
    viewport?.removeEventListener('resize', onChange)
    document.removeEventListener('focusin', onChange)
    document.removeEventListener('focusout', onChange)
  }
}

function getSnapshot() {
  const viewport = window.visualViewport
  if (!viewport || !isEditable(document.activeElement)) return false
  return window.innerHeight - viewport.height > KEYBOARD_THRESHOLD_PX
}

export function useKeyboardOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
