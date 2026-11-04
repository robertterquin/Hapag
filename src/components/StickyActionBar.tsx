import type { ReactNode } from 'react'
import { useKeyboardOpen } from '../hooks/useKeyboardOpen.ts'

interface StickyActionBarProps {
  summary?: ReactNode
  children: ReactNode
  active?: boolean
}

export function StickyActionBar({ summary, children, active = false }: StickyActionBarProps) {
  const keyboardOpen = useKeyboardOpen()

  return (
    <div className={`sticky-action-bar ${active ? 'sticky-action-bar-active' : ''} ${keyboardOpen ? 'sticky-action-bar-hidden' : ''}`}>
      {summary ? <div className="sticky-action-summary" aria-live="polite">{summary}</div> : null}
      <div className="sticky-action-buttons">{children}</div>
    </div>
  )
}
