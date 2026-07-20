interface RoutePlaceholderProps {
  eyebrow: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function RoutePlaceholder({ eyebrow, title, description, actionLabel, onAction }: RoutePlaceholderProps) {
  return (
    <section className="placeholder-page" aria-labelledby="placeholder-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1 id="placeholder-title">{title}</h1>
      <p>{description}</p>
      {actionLabel && onAction ? (
        <button className="button button-primary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  )
}
