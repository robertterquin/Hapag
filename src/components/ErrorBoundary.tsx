import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportError } from '../lib/errorReporting.ts'
import { StatePanel } from './StatePanel.tsx'

interface ErrorBoundaryProps {
  children: ReactNode
  area: string
  onHome?: () => void
}

interface ErrorBoundaryState {
  failed: boolean
}

// Shows a calm recovery screen instead of a blank page when rendering throws.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { area: this.props.area, component: info.componentStack?.trim().split('\n')[0] ?? 'unknown' })
  }

  private retry = () => this.setState({ failed: false })

  private goHome = () => {
    this.setState({ failed: false })
    if (this.props.onHome) this.props.onHome()
    else window.location.assign('/')
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="page-shell">
        <StatePanel
          tone="error"
          icon="🍳"
          title="Something went wrong"
          description="This page hit a snag. Try again, or head back home."
          actionLabel="Try again"
          onAction={this.retry}
          secondaryLabel="Back to home"
          onSecondary={this.goHome}
        />
      </div>
    )
  }
}
