import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { addCollection, type IconifyJSON } from '@iconify/react'
import iconCollections from './data/icons.json'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { initErrorReporting, reportError } from './lib/errorReporting.ts'

initErrorReporting()
// Icons ship with the app (see scripts/build-icons.mjs), so they show offline and nothing is fetched from Iconify.
for (const collection of iconCollections as unknown as IconifyJSON[]) addCollection(collection)
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
