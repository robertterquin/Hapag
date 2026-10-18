import type { ReactNode } from 'react'
import { useKeyboardOpen } from '../hooks/useKeyboardOpen.ts'

interface StickyActionBarProps {
  summary?: ReactNode
  children: ReactNode
}

export function StickyActionBar({ summary, children }: StickyActionBarProps) {
  const keyboardOpen = useKeyboardOpen()

  return (
    <div className={`sticky-action-bar ${keyboardOpen ? 'sticky-action-bar-hidden' : ''}`}>
      {summary ? <div className="sticky-action-summary" aria-live="polite">{summary}</div> : null}
      <div className="sticky-action-buttons">{children}</div>
    </div>
  )
}
