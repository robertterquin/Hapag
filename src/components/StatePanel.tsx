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
    <section className={`state-panel state-panel-${tone}`} aria-live={tone === 'error' ? 'assertive' : 'polite'}>
      <span className="state-icon" aria-hidden="true">{icon}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="state-actions">
        {actionLabel && onAction ? <button className="button button-primary" type="button" onClick={onAction}>{actionLabel}</button> : null}
        {secondaryLabel && onSecondary ? <button className="button button-secondary" type="button" onClick={onSecondary}>{secondaryLabel}</button> : null}
      </div>
    </section>
  )
}
