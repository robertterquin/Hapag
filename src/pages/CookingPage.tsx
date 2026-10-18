import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { RecipeFeedback } from '../components/RecipeFeedback.tsx'
import { useRecipe } from '../hooks/useRecipe.ts'
import { soundManager } from '../lib/audioAlert.ts'
import { useWakeLock } from '../hooks/useWakeLock.ts'
import { useVoiceReadout } from '../hooks/useVoiceReadout.ts'
import { useDisplayLanguage } from '../app/displayLanguage.ts'
import { formatQuantity } from '../lib/format.ts'
import { labelForIngredient } from '../lib/ingredientLabels.ts'
import { getLeftovers, getStepIngredients } from '../lib/stepIngredients.ts'
import type { RecipeFeedbackKind } from '../hooks/useRecipeFeedback.ts'
import type { NormalizedIngredient } from '../types/domain.ts'

export interface CookingPageProps {
  recipeId: string
  isSignedIn: boolean
  feedback?: RecipeFeedbackKind
  sessionIngredients: NormalizedIngredient[]
  onFinish: () => void
  onBack: () => void
  onFeedback: (kind: RecipeFeedbackKind) => void
  onUseLeftovers: (names: string[], recipeTitle: string) => void
}

function formatHeat(heat?: 'low' | 'medium' | 'high' | 'none' | null): string {
  switch (heat) {
    case 'low': return 'Low heat'
    case 'medium': return 'Medium heat'
    case 'high': return 'High heat'
    default: return 'Preparation'
  }
}

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

const MIN_SWIPE_DISTANCE = 50

export function CookingPage({ recipeId, isSignedIn, feedback, sessionIngredients, onFinish, onBack, onFeedback, onUseLeftovers }: CookingPageProps) {
  const { recipe } = useRecipe(recipeId)
  const language = useDisplayLanguage()
  useWakeLock()
  const { isSupported: isVoiceSupported, isSpeaking, stop: stopVoice, toggle: toggleVoice } = useVoiceReadout()
  const [stepIndex, setStepIndex] = useState(0)
  // One timer at a time. It belongs to the step it was started on and keeps running across steps.
  const [timerStepIndex, setTimerStepIndex] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerFinished, setTimerFinished] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [cookingStartTime] = useState(() => Date.now())
  const [cookingMinutes, setCookingMinutes] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('hapag_sound_enabled') !== 'false'
  })

  const stepCount = recipe?.steps.length ?? 0
  const step = recipe?.steps[stepIndex]
  const defaultDurationSeconds = (step?.durationMinutes ?? 2) * 60
  const timerOnThisStep = timerStepIndex === stepIndex
  const timerActive = timerStepIndex !== null && (timerRunning || timerFinished || timerSeconds > 0)

  const completeCooking = useCallback(() => {
    setCookingMinutes(Math.max(1, Math.round((Date.now() - cookingStartTime) / 60000)))
    setShowCompletion(true)
  }, [cookingStartTime])

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev
      try { localStorage.setItem('hapag_sound_enabled', String(next)) } catch { /* Preference only lasts this session. */ }
      if (next) {
        soundManager.unlock()
        soundManager.playConfirmationPing()
      }
      return next
    })
  }

  const handleStepChange = useCallback((newIndex: number) => {
    stopVoice()
    setStepIndex(newIndex)
  }, [stopVoice])

  const goNext = useCallback(() => {
    if (stepIndex < stepCount - 1) handleStepChange(stepIndex + 1)
    else completeCooking()
  }, [stepIndex, stepCount, handleStepChange, completeCooking])

  const goPrevious = useCallback(() => {
    if (stepIndex > 0) handleStepChange(stepIndex - 1)
  }, [stepIndex, handleStepChange])

  const handleTimerToggle = useCallback(() => {
    soundManager.unlock()
    if (!timerOnThisStep || timerFinished || (!timerRunning && timerSeconds === 0)) {
      setTimerStepIndex(stepIndex)
      setTimerFinished(false)
      setTimerSeconds(timerOnThisStep && timerSeconds > 0 && !timerFinished ? timerSeconds : defaultDurationSeconds)
      setTimerRunning(true)
      return
    }
    setTimerRunning((prev) => !prev)
  }, [timerOnThisStep, timerFinished, timerRunning, timerSeconds, stepIndex, defaultDurationSeconds])

  const handleTimerAdjust = (deltaSeconds: number) => {
    soundManager.unlock()
    const base = timerOnThisStep && timerSeconds > 0 ? timerSeconds : defaultDurationSeconds
    if (!timerOnThisStep) setTimerRunning(false)
    setTimerStepIndex(stepIndex)
    setTimerSeconds(Math.max(10, base + deltaSeconds))
    setTimerFinished(false)
  }

  const handleTimerReset = useCallback(() => {
    setTimerRunning(false)
    setTimerFinished(false)
    setTimerSeconds(0)
    setTimerStepIndex(null)
  }, [])

  useEffect(() => {
    if (!timerRunning) return undefined
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false)
          setTimerFinished(true)
          if (soundEnabled) soundManager.playTimerChime()
          if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate([200, 100, 200])
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [timerRunning, soundEnabled])

  const readStepAloud = useCallback(() => {
    if (!step || !recipe) return
    const heatPart = step.heat && step.heat !== 'none' ? `Heat: ${step.heat}.` : ''
    const durationPart = step.durationMinutes ? `Duration: about ${step.durationMinutes} minutes.` : ''
    toggleVoice(`${step.action}. ${durationPart} ${heatPart}`.trim(), `/audio/steps/${recipe.id}-step-${step.order}.mp3`)
  }, [step, recipe, toggleVoice])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return
      if (showCompletion) return
      if (event.key === 'ArrowRight' || event.key === 'j' || event.key === 'J') { event.preventDefault(); goNext() }
      else if (event.key === 'ArrowLeft' || event.key === 'k' || event.key === 'K') { event.preventDefault(); goPrevious() }
      else if (event.key === ' ' || event.code === 'Space') { event.preventDefault(); handleTimerToggle() }
      else if (event.key === 'r' || event.key === 'R') { event.preventDefault(); handleTimerReset() }
      else if (event.key === 'v' || event.key === 'V') { event.preventDefault(); readStepAloud() }
      else if (event.key === 'Escape') { event.preventDefault(); onBack() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrevious, handleTimerToggle, handleTimerReset, readStepAloud, onBack, showCompletion])

  if (!recipe || !step) return <div className="page-shell"><ResultsSkeleton /></div>

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    if (distance > MIN_SWIPE_DISTANCE && stepIndex < stepCount - 1) handleStepChange(stepIndex + 1)
    else if (distance < -MIN_SWIPE_DISTANCE) goPrevious()
  }

  const stepIngredients = getStepIngredients(step, recipe.ingredients)
  const leftovers = getLeftovers(sessionIngredients, recipe)
  const shownSeconds = timerOnThisStep ? timerSeconds : 0
  const shownRunning = timerOnThisStep && timerRunning
  const shownFinished = timerOnThisStep && timerFinished
  const progress = ((stepIndex + 1) / stepCount) * 100
  const isLastStep = stepIndex === stepCount - 1

  return (
    <div className="cooking-page">
      <header className="cooking-bar">
        <button className="cooking-icon-button" type="button" onClick={onBack} aria-label="Exit cooking mode">
          <Icon icon="lucide:x" width={20} height={20} aria-hidden="true" />
        </button>
        <div className="cooking-bar-title">
          <span>Cooking mode</span>
          <strong>{recipe.title}</strong>
        </div>
        <span className="cooking-bar-count" aria-label={`Step ${stepIndex + 1} of ${stepCount}`}>{stepIndex + 1} / {stepCount}</span>
        <button
          className={`cooking-icon-button ${soundEnabled ? '' : 'cooking-icon-button-muted'}`}
          type="button"
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? 'Timer sound on. Mute' : 'Timer sound muted. Turn on'}
        >
          <Icon icon={soundEnabled ? 'lucide:volume-2' : 'lucide:volume-x'} width={18} height={18} aria-hidden="true" />
        </button>
      </header>
      <div className="progress-track cooking-progress" aria-hidden="true">
        <motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.22, ease: 'easeOut' }} />
      </div>

      <section
        className="cooking-step-card"
        aria-live="polite"
        onTouchStart={(event) => { setTouchEnd(null); setTouchStart(event.targetTouches[0].clientX) }}
        onTouchMove={(event) => setTouchEnd(event.targetTouches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="cooking-step-content"
            key={step.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="cooking-step-header-row">
              <span className="step-kicker">Step {stepIndex + 1}</span>
              {isVoiceSupported ? (
                <button className={`cooking-voice-button ${isSpeaking ? 'voice-speaking' : ''}`} type="button" onClick={readStepAloud} aria-label={isSpeaking ? 'Stop reading this step' : 'Read this step aloud'}>
                  <Icon icon={isSpeaking ? 'lucide:pause' : 'lucide:volume-2'} width={14} height={14} aria-hidden="true" />
                  <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                </button>
              ) : null}
            </div>

            <h1>{step.action}</h1>
            <div className="step-details">
              <span>{step.durationMinutes ? `About ${step.durationMinutes} min` : 'Until cooked'}</span>
              <span>{formatHeat(step.heat)}</span>
            </div>

            {stepIngredients.length > 0 ? (
              <div className="step-ingredients" aria-label="Ingredients for this step">
                <span className="step-ingredients-label">For this step</span>
                <ul>
                  {stepIngredients.map((ingredient) => (
                    <li key={ingredient.id}>{formatQuantity(ingredient.quantity, ingredient.unit)} {ingredient.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="timer-row">
              <button className="timer-adjust-button" type="button" onClick={() => handleTimerAdjust(-60)} aria-label="One minute less">−1m</button>
              <motion.button
                className={`timer-button ${shownFinished ? 'timer-button-finished' : shownRunning ? 'timer-button-active' : shownSeconds > 0 ? 'timer-button-paused' : ''}`}
                type="button"
                onClick={handleTimerToggle}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.12 }}
              >
                <Icon icon={shownFinished ? 'lucide:check' : shownRunning ? 'lucide:pause' : 'lucide:timer'} width={18} height={18} aria-hidden="true" />
                <span>
                  {shownFinished ? "Time's up · restart" : shownRunning ? formatClock(shownSeconds) : shownSeconds > 0 ? `Resume ${formatClock(shownSeconds)}` : `Start ${formatClock(defaultDurationSeconds)}`}
                </span>
              </motion.button>
              <button className="timer-adjust-button" type="button" onClick={() => handleTimerAdjust(60)} aria-label="One minute more">+1m</button>
            </div>
            {timerOnThisStep && timerActive ? (
              <button className="timer-reset-button" type="button" onClick={handleTimerReset}>
                <Icon icon="lucide:rotate-ccw" width={14} height={14} aria-hidden="true" /> Reset timer
              </button>
            ) : null}
            {shownFinished ? <p className="timer-alert-cue" role="status">Time's up for this step.</p> : null}
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="cooking-controls">
        <button className="button button-secondary" type="button" disabled={stepIndex === 0} onClick={goPrevious}>
          <Icon icon="lucide:arrow-left" width={18} height={18} aria-hidden="true" /> Previous
        </button>
        <button className="button button-primary" type="button" onClick={goNext}>
          {isLastStep ? 'Finish' : 'Next'} <Icon icon={isLastStep ? 'lucide:check' : 'lucide:arrow-right'} width={18} height={18} aria-hidden="true" />
        </button>
      </div>
      <p className="cooking-note">Swipe left or right to change steps. Use your judgment on cooking times and food safety.</p>

      <AnimatePresence>
        {timerActive && !timerOnThisStep && timerStepIndex !== null && !showCompletion ? (
          <motion.button
            className={`timer-pill ${timerFinished ? 'timer-pill-finished' : ''}`}
            type="button"
            onClick={() => handleStepChange(timerStepIndex)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            aria-label={`Timer for step ${timerStepIndex + 1}: ${timerFinished ? "time's up" : formatClock(timerSeconds)}. Go to step ${timerStepIndex + 1}`}
          >
            <Icon icon={timerFinished ? 'lucide:bell-ring' : 'lucide:timer'} width={16} height={16} aria-hidden="true" />
            <span>{timerFinished ? "Time's up" : formatClock(timerSeconds)}</span>
            <small>Step {timerStepIndex + 1}</small>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCompletion ? (
          <motion.div className="completion-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="completion-card" role="dialog" aria-modal="true" aria-labelledby="completion-title" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}>
              <span className="completion-emoji" aria-hidden="true">🎉</span>
              <h2 className="completion-title" id="completion-title">Luto na!</h2>
              <p className="completion-dish">{recipe.title}</p>
              <p className="completion-time">Cooked in about {cookingMinutes} {cookingMinutes === 1 ? 'minute' : 'minutes'}</p>
              <RecipeFeedback value={feedback} onChange={onFeedback} label="How did it turn out?" />
              <div className="completion-actions">
                <button className="button button-primary" type="button" onClick={onFinish}>
                  {isSignedIn ? 'Mark as cooked' : 'Sign in to save as cooked'}
                </button>
                {leftovers.length > 0 ? (
                  <button className="button button-secondary" type="button" onClick={() => onUseLeftovers(leftovers.map((item) => item.name), recipe.title)}>
                    Use the leftovers: {leftovers.slice(0, 3).map((item) => labelForIngredient(item, language)).join(', ')}{leftovers.length > 3 ? ` +${leftovers.length - 3}` : ''}
                  </button>
                ) : null}
                <button className="text-button" type="button" onClick={() => { setShowCompletion(false); handleTimerReset(); handleStepChange(0) }}>Cook it again</button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
