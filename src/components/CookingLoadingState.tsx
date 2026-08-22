import { useEffect, useState } from 'react'

const messages = [
  'Tinitingnan ang mga sangkap mo…',
  'Naghahanap ng bagay sa panlasa mo…',
  'Inihahanda ang mga ideya…',
]

export function CookingLoadingState() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setMessageIndex((current) => (current + 1) % messages.length), 1800)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="cooking-loading" aria-live="polite">
      <span className="cooking-loading-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="loading-spinner">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </span>
      <div>
        <strong>{messages[messageIndex]}</strong>
        <p>Sandali lang—maghahanda kami ng tatlong praktikal na pagpipilian.</p>
      </div>
    </section>
  )
}
