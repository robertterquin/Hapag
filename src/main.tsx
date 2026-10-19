import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { initErrorReporting, reportError } from './lib/errorReporting.ts'

initErrorReporting()
window.addEventListener('unhandledrejection', (event) => reportError(event.reason, { area: 'promise' }))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ErrorBoundary area="app">
        <App />
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
)
