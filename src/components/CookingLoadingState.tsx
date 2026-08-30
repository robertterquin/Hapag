import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { NormalizedIngredient } from '../types/domain.ts'
import { getMascotLoadingBanter } from '../lib/mascotBanter.ts'
import { ChefKalabaw } from './ChefKalabaw.tsx'

interface CookingLoadingStateProps {
  ingredients?: NormalizedIngredient[]
  rawInput?: string
}

export function CookingLoadingState({ ingredients = [], rawInput = '' }: CookingLoadingStateProps) {
  const [banterIndex, setBanterIndex] = useState(0)

  const banters = useMemo(() => {
    return getMascotLoadingBanter(ingredients, rawInput)
  }, [ingredients, rawInput])

  useEffect(() => {
    if (banters.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setBanterIndex((current) => (current + 1) % banters.length)
    }, 2400)
    return () => window.clearInterval(timer)
  }, [banters])

  const activeBanter = banters[banterIndex] || banters[0]

  return (
    <section className="cooking-loading-mascot-card" aria-live="polite">
      <div className="mascot-avatar-area">
        <ChefKalabaw size={150} />
      </div>

      <div className="mascot-dialogue-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={banterIndex}
            className="mascot-speech-bubble"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="mascot-speech-header">
              <span className="mascot-chef-name">Chef Kalabaw</span>
              <span className="mascot-speech-tag">{activeBanter.tag}</span>
            </div>
            <strong className="mascot-speech-headline">{activeBanter.headline}</strong>
            <p className="mascot-speech-subline">{activeBanter.subline}</p>
            {activeBanter.tip && (
              <div className="mascot-speech-tip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>{activeBanter.tip}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mascot-loading-progress-bar" aria-hidden="true">
          <motion.div
            className="mascot-progress-indicator"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  )
}
