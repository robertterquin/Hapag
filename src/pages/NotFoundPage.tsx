import { StatePanel } from '../components/StatePanel.tsx'

export interface NotFoundPageProps {
  onBack: () => void
}

export function NotFoundPage({ onBack }: NotFoundPageProps) {
  return (
    <StatePanel
      tone="empty"
      icon="?"
      title="Page not found"
      description="The requested page could not be found."
      actionLabel="Back to Home"
      onAction={onBack}
    />
  )
}

