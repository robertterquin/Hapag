import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { NormalizedIngredient } from '../types/domain.ts'
import type { DishIdea } from '../lib/catalogIdeas.ts'
import { getMascotLoadingBanter } from '../lib/mascotBanter.ts'
import { kusinaProgress } from '../lib/kusinaProgress.ts'
import { ChefKalabaw } from './ChefKalabaw.tsx'
import { DishShortlist } from './DishShortlist.tsx'
import { KusinaSteps } from './KusinaSteps.tsx'

interface CookingLoadingStateProps {
  ingredients?: NormalizedIngredient[]
  rawInput?: string
  // Catalog matches found before the AI call; shown as the shortlist.
  ideas?: DishIdea[]
}

function getStirFeedback(count: number): { text: string; sub: string } {
  if (count === 0) return { text: 'Tap to stir the pot!', sub: 'Give Chef Kalabaw a hand while waiting' }
  if (count === 1) return { text: '1x stirred! Smells delicious...', sub: 'Aromatic steam rising!' }
  if (count <= 3) return { text: `${count}x stirred! Keep it up!`, sub: 'Home-cooked aroma in the kitchen...' }
  if (count <= 6) return { text: `${count}x stirred! Perfect seasoning!`, sub: 'The clay pot is simmering!' }
  if (count <= 9) return { text: `${count}x stirred! Seasoned chef!`, sub: 'Broth is simmering smoothly!' }
  return { text: `${count}x stirred! Master Chef level unlocked!`, sub: 'Your meal is almost ready!' }
}

export function CookingLoadingState({ ingredients = [], rawInput = '', ideas = [] }: CookingLoadingStateProps) {
  const [banterIndex, setBanterIndex] = useState(0)
  const [stirCount, setStirCount] = useState(0)
  const [startedAt] = useState(() => Date.now())
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startedAt), 250)
    return () => window.clearInterval(timer)
  }, [startedAt])

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

  const handleStir = () => {
    setStirCount((prev) => prev + 1)
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(25)
    }
  }

  const activeBanter = banters[banterIndex] || banters[0]
  const stirFeedback = getStirFeedback(stirCount)
  // His pose follows the steps: reading your list, pleased with the matches, then stirring while the AI writes.
  const { active } = kusinaProgress(elapsedMs)
  const mood = active === 0 ? 'idle' : active === 1 ? 'excited' : 'stir'

  return (
    <section className="cooking-loading-mascot-card" aria-label="Finding dishes">
      <div className="loading-host">
        <div className="loading-chef">
          {/* Tapping Chef Kalabaw stirs too; the pill below is the accessible control for the same action. */}
          <div className="chef-kalabaw-tap" onClick={handleStir} aria-hidden="true">
            <ChefKalabaw mood={mood} size={140} stirKey={stirCount} />
          </div>
          <motion.button
            type="button"
            className={`mascot-stir-pill ${stirCount > 0 ? 'stir-active' : ''}`}
            onClick={handleStir}
            whileTap={{ scale: 0.94 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <span>{stirFeedback.text}</span>
          </motion.button>
        </div>
        {/* Chef Kalabaw announces the page title; his running commentary under it is decorative,
            so screen readers hear the steps instead. */}
        <div className="loading-bubble">
          <h1>Finding dishes…</h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={banterIndex}
              aria-hidden="true"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <b>Chef Kalabaw:</b> {activeBanter.headline}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <KusinaSteps elapsedMs={elapsedMs} />
      <DishShortlist ideas={ideas} />
    </section>
  )
}
