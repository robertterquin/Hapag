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
      <span className="cooking-loading-icon" aria-hidden="true">🍲</span>
      <div>
        <strong>{messages[messageIndex]}</strong>
        <p>Sandali lang—maghahanda kami ng tatlong praktikal na pagpipilian.</p>
      </div>
    </section>
  )
}
