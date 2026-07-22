import { motion } from 'motion/react'

interface StatePanelProps {
  tone?: 'empty' | 'error' | 'offline' | 'info'
  icon?: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export function StatePanel({ tone = 'empty', icon = '🍲', title, description, actionLabel, onAction, secondaryLabel, onSecondary }: StatePanelProps) {
  return (
    <motion.section className={`state-panel state-panel-${tone}`} aria-live={tone === 'error' ? 'assertive' : 'polite'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
      <span className="state-icon" aria-hidden="true">{icon}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="state-actions">
        {actionLabel && onAction ? <motion.button className="button button-primary" type="button" onClick={onAction} whileTap={{ scale: 0.985 }} transition={{ duration: 0.12 }}>{actionLabel}</motion.button> : null}
        {secondaryLabel && onSecondary ? <motion.button className="button button-secondary" type="button" onClick={onSecondary} whileTap={{ scale: 0.985 }} transition={{ duration: 0.12 }}>{secondaryLabel}</motion.button> : null}
      </div>
    </motion.section>
  )
}
