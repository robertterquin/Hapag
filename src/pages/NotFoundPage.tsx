import { RoutePlaceholder } from '../components/RoutePlaceholder.tsx'

export interface NotFoundPageProps {
  onBack: () => void
}

export function NotFoundPage({ onBack }: NotFoundPageProps) {
  return <RoutePlaceholder eyebrow="Not found" title="That kitchen corner is empty." description="This route does not exist yet." actionLabel="Back to Home" onAction={onBack} />
}
