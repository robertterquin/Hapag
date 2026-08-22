import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { useRecipe } from '../hooks/useRecipe.ts'

export interface CookingPageProps {
  recipeId: string
  onFinish: () => void
  onBack: () => void
}

export function CookingPage({ recipeId, onFinish, onBack }: CookingPageProps) {
  const { recipe } = useRecipe(recipeId)
  const [stepIndex, setStepIndex] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    if (!timerRunning) return undefined
    const interval = window.setInterval(() => setTimerSeconds((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(interval)
  }, [timerRunning])

  if (!recipe) return <div className="page-shell"><ResultsSkeleton /></div>
  const step = recipe.steps[stepIndex]
  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, '0')
  const seconds = (timerSeconds % 60).toString().padStart(2, '0')
  const timerLabel = timerSeconds > 0 ? `${minutes}:${seconds}` : step.durationMinutes ? `${String(step.durationMinutes).padStart(2, '0')}:00` : '02:00'
  const progress = ((stepIndex + 1) / recipe.steps.length) * 100

  return (
    <div className="cooking-page">
      <div className="cooking-topbar">
        <button className="cooking-back-button" type="button" onClick={onBack}>
          ← Bumalik sa recipe
        </button>
        <div className="cooking-dish-header">
          <span className="cooking-mode-kicker">Paraan ng pagluluto</span>
          <h2 className="cooking-dish-title">{recipe.title}</h2>
        </div>
        <div className="cooking-step-badge">
          <span>Hakbang {step.order} / {recipe.steps.length}</span>
        </div>
      </div>
      <div className="cooking-progress-header"><span>Hakbang {step.order} sa {recipe.steps.length}</span><strong>{Math.round(progress)}%</strong></div>
      <div className="progress-track"><motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.22, ease: 'easeOut' }} /></div>
      <section className="cooking-step-card" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className="cooking-step-content" key={step.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            <span className="step-kicker">Gawin ito ngayon</span>
            <h1>{step.action}</h1>
            <div className="step-details"><span>{step.durationMinutes ? `Humigit-kumulang ${step.durationMinutes} minuto` : 'Hanggang maluto'}</span><span>{step.heat && step.heat !== 'none' ? `Katamtamang init: ${step.heat}` : 'Paghahanda'}</span></div>
            <motion.button className={`timer-button ${timerRunning ? 'timer-button-active' : ''}`} type="button" onClick={() => { if (!timerRunning && timerSeconds === 0) setTimerSeconds((step.durationMinutes ?? 2) * 60); setTimerRunning(!timerRunning) }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.12 }}>
              <span aria-hidden="true">◷</span> {timerRunning ? timerLabel : `Simulan ang timer: ${timerLabel}`}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </section>
      <div className="cooking-controls"><button className="button button-secondary" type="button" disabled={stepIndex === 0} onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}>← Nakaraan</button><button className="button button-primary" type="button" onClick={() => stepIndex === recipe.steps.length - 1 ? onFinish() : setStepIndex(stepIndex + 1)}>{stepIndex === recipe.steps.length - 1 ? 'Tapos na' : 'Susunod →'}</button></div>
      <p className="cooking-note">Ilagay sa malapit ang iyong telepono at gamitin ang iyong pinakamahusay na pagpapasya para sa pagkakaluto at kaligtasan ng pagkain.</p>
    </div>
  )
}
