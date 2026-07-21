import { useEffect, useState } from 'react'
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

  return (
    <div className="cooking-page">
      <div className="cooking-topbar"><button className="back-button" type="button" onClick={onBack}>â† Recipe</button><span className="cooking-title">Cooking mode</span><span className="cooking-dish">{recipe.title}</span></div>
      <div className="cooking-progress-header"><span>Step {step.order} of {recipe.steps.length}</span><strong>{Math.round(((stepIndex + 1) / recipe.steps.length) * 100)}%</strong></div>
      <div className="progress-track"><span style={{ width: `${((stepIndex + 1) / recipe.steps.length) * 100}%` }} /></div>
      <section className="cooking-step-card" aria-live="polite">
        <span className="step-kicker">Do this now</span>
        <h1>{step.action}</h1>
        <div className="step-details"><span>{step.durationMinutes ? `About ${step.durationMinutes} minutes` : 'Until ready'}</span><span>{step.heat && step.heat !== 'none' ? `${step.heat} heat` : 'Prep'}</span></div>
        <button className={`timer-button ${timerRunning ? 'timer-button-active' : ''}`} type="button" onClick={() => { if (!timerRunning && timerSeconds === 0) setTimerSeconds((step.durationMinutes ?? 2) * 60); setTimerRunning(!timerRunning) }}>
          <span aria-hidden="true">â—·</span> {timerRunning ? timerLabel : `Start ${timerLabel} timer`}
        </button>
      </section>
      <div className="cooking-controls"><button className="button button-secondary" type="button" disabled={stepIndex === 0} onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}>â† Previous</button><button className="button button-primary" type="button" onClick={() => stepIndex === recipe.steps.length - 1 ? onFinish() : setStepIndex(stepIndex + 1)}>{stepIndex === recipe.steps.length - 1 ? 'Finish cooking' : 'Next step â†’'}</button></div>
      <p className="cooking-note">Keep your phone nearby, and use your best judgment for doneness and food safety.</p>
    </div>
  )
}
