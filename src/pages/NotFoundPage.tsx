import { StatePanel } from '../components/StatePanel.tsx'

export interface NotFoundPageProps {
  onBack: () => void
}

export function NotFoundPage({ onBack }: NotFoundPageProps) {
  return <StatePanel tone="empty" icon="?" title="Walang laman ang page na ito." description="Hindi pa umiiral ang route na ito." actionLabel="Bumalik sa Home" onAction={onBack} />
}
