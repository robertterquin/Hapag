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
      description="This link doesn't lead anywhere. Let's get you back to cooking."
      actionLabel="Back to home"
      onAction={onBack}
    />
  )
}

