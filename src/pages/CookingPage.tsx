import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ResultsSkeleton } from '../components/Skeletons.tsx'
import { useRecipe } from '../hooks/useRecipe.ts'
import { soundManager } from '../lib/audioAlert.ts'
import { useWakeLock } from '../hooks/useWakeLock.ts'
import { useVoiceReadout } from '../hooks/useVoiceReadout.ts'

export interface CookingPageProps {
  recipeId: string
  onFinish: () => void
  onBack: () => void
}

function formatHeatTagalog(heat?: 'low' | 'medium' | 'high' | 'none' | null): string {
  switch (heat) {
    case 'low': return 'Mahinang init'
    case 'medium': return 'Katamtamang init'
    case 'high': return 'Malakas na init'
    default: return 'Paghahanda'
  }
}

export function CookingPage({ recipeId, onFinish, onBack }: CookingPageProps) {
  const { recipe } = useRecipe(recipeId)
  useWakeLock()
  const { isSupported: isVoiceSupported, isSpeaking, stop: stopVoice, toggle: toggleVoice } = useVoiceReadout()
  const [stepIndex, setStepIndex] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerFinished, setTimerFinished] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const cookingStartTime = useRef(Date.now())
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('hapag_sound_enabled') !== 'false'
  })

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('hapag_sound_enabled', String(next))
      }
      if (next) {
        soundManager.unlock()
        soundManager.playConfirmationPing()
      }
      return next
    })
  }

  const step = recipe?.steps[stepIndex]
  const defaultDurationSeconds = (step?.durationMinutes ?? 2) * 60

  const handleStepChange = useCallback((newIndex: number) => {
    stopVoice()
    setTimerRunning(false)
    setTimerFinished(false)
    setTimerSeconds(0)
    setStepIndex(newIndex)
  }, [stopVoice])

  const handleTimerToggle = useCallback(() => {
    soundManager.unlock()
    if (timerFinished) {
      setTimerFinished(false)
      setTimerSeconds(defaultDurationSeconds)
      setTimerRunning(true)
      return
    }

    if (!timerRunning && timerSeconds === 0) {
      setTimerSeconds(defaultDurationSeconds)
      setTimerRunning(true)
      return
    }

    setTimerRunning((prev) => !prev)
  }, [timerFinished, timerRunning, timerSeconds, defaultDurationSeconds])

  const handleTimerAdjust = (deltaSeconds: number) => {
    soundManager.unlock()
    setTimerSeconds((prev) => {
      const base = prev > 0 ? prev : defaultDurationSeconds
      const next = Math.max(10, base + deltaSeconds)
      return next
    })
    setTimerFinished(false)
  }

  const handleTimerReset = useCallback(() => {
    setTimerRunning(false)
    setTimerFinished(false)
    setTimerSeconds(0)
  }, [])

  useEffect(() => {
    if (!timerRunning) return undefined
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false)
          setTimerFinished(true)
          if (soundEnabled) {
            soundManager.playTimerChime()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [timerRunning, soundEnabled])

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && stepIndex < (recipe?.steps.length ?? 0) - 1) {
      handleStepChange(stepIndex + 1)
    } else if (isRightSwipe && stepIndex > 0) {
      handleStepChange(stepIndex - 1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        if (stepIndex < (recipe?.steps.length ?? 0) - 1) {
          handleStepChange(stepIndex + 1)
        } else if (stepIndex === (recipe?.steps.length ?? 0) - 1) {
          setShowCompletion(true)
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        if (stepIndex > 0) {
          handleStepChange(stepIndex - 1)
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        handleTimerToggle()
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        handleTimerReset()
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault()
        if (step && recipe) {
          const heatPart = step.heat && step.heat !== 'none' ? `Heat: ${step.heat}.` : ''
          const durationPart = step.durationMinutes ? `Duration: about ${step.durationMinutes} minutes.` : ''
          const spokenText = `${step.action}. ${durationPart} ${heatPart}`.trim()
          const audioUrl = `/audio/steps/${recipe.id}-step-${step.order}.mp3`
          toggleVoice(spokenText, audioUrl)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stepIndex, recipe, step, handleStepChange, handleTimerToggle, handleTimerReset, onFinish, toggleVoice])

  if (!recipe || !step) return <div className="page-shell"><ResultsSkeleton /></div>

  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, '0')
  const seconds = (timerSeconds % 60).toString().padStart(2, '0')
  const formattedCountdown = `${minutes}:${seconds}`
  const formattedDefault = step.durationMinutes ? `${String(step.durationMinutes).padStart(2, '0')}:00` : '02:00'

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
        <div className="cooking-topbar-actions">
          <button
            className={`cooking-sound-toggle ${soundEnabled ? 'sound-active' : 'sound-muted'}`}
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'I-mute ang tunog ng timer' : 'I-on ang tunog ng timer'}
            title={soundEnabled ? 'Tunog: Naka-on' : 'Tunog: Naka-mute'}
          >
            <svg className="sound-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {soundEnabled ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              ) : (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              )}
            </svg>
            <span className="sound-toggle-text">{soundEnabled ? 'Tunog' : 'Muted'}</span>
          </button>
          <div className="cooking-step-badge">
            <span>Hakbang {step.order} / {recipe.steps.length}</span>
          </div>
        </div>
      </div>

      <div className="cooking-progress-header">
        <span>Hakbang {step.order} sa {recipe.steps.length}</span>
        <strong>{Math.round(progress)}%</strong>
      </div>
      <div className="progress-track">
        <motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.22, ease: 'easeOut' }} />
      </div>

      <section
        className="cooking-step-card"
        aria-live="polite"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="cooking-step-content"
            key={step.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="cooking-step-header-row">
              <span className="step-kicker">Gawin ito ngayon</span>
              {isVoiceSupported && (
                <button
                  className={`cooking-voice-button ${isSpeaking ? 'voice-speaking' : ''}`}
                  type="button"
                  onClick={() => {
                    const heatPart = step.heat && step.heat !== 'none' ? `Heat: ${step.heat}.` : ''
                    const durationPart = step.durationMinutes ? `Duration: about ${step.durationMinutes} minutes.` : ''
                    const spokenText = `${step.action}. ${durationPart} ${heatPart}`.trim()
                    const audioUrl = `/audio/steps/${recipe.id}-step-${step.order}.mp3`
                    toggleVoice(spokenText, audioUrl)
                  }}
                  aria-label={isSpeaking ? 'Itigil ang pagbasa ng boses' : 'Pakinggan ang hakbang sa boses'}
                  title={isSpeaking ? 'Itigil ang boses' : 'Basahin ang hakbang'}
                >
                  <svg className="voice-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {isSpeaking ? (
                      <>
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </>
                    ) : (
                      <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </>
                    )}
                  </svg>
                  <span>{isSpeaking ? 'Itigil ang Boses' : 'Pakinggan'}</span>
                  {isSpeaking && (
                    <span className="voice-waveform" aria-hidden="true">
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                    </span>
                  )}
                </button>
              )}
            </div>

            <h1>{step.action}</h1>
            <div className="step-details">
              <span>{step.durationMinutes ? `Humigit-kumulang ${step.durationMinutes} minuto` : 'Hanggang maluto'}</span>
              <span>{formatHeatTagalog(step.heat)}</span>
            </div>

            <div className="timer-controls-cluster">
              <button
                className="timer-adjust-button"
                type="button"
                onClick={() => handleTimerAdjust(-60)}
                aria-label="Bawasan ng 1 minuto"
                title="Bawasan ng 1 minuto"
              >
                −1m
              </button>
              <motion.button
                className={`timer-button ${
                  timerFinished
                    ? 'timer-button-finished'
                    : timerRunning
                    ? 'timer-button-active'
                    : timerSeconds > 0
                    ? 'timer-button-paused'
                    : ''
                }`}
                type="button"
                onClick={handleTimerToggle}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.12 }}
              >
                <span className="timer-icon" aria-hidden="true">
                  {timerFinished ? '✓' : timerRunning ? '❚❚' : '◷'}
                </span>
                <span>
                  {timerFinished
                    ? 'Tapos na ang oras! (Ulitin)'
                    : timerRunning
                    ? `I-pause: ${formattedCountdown}`
                    : timerSeconds > 0
                    ? `Ipagpatuloy: ${formattedCountdown}`
                    : `Simulan ang timer: ${formattedDefault}`}
                </span>
              </motion.button>
              <button
                className="timer-adjust-button"
                type="button"
                onClick={() => handleTimerAdjust(60)}
                aria-label="Dagdagan ng 1 minuto"
                title="Dagdagan ng 1 minuto"
              >
                +1m
              </button>

              {(timerRunning || timerSeconds > 0 || timerFinished) && (
                <button
                  className="timer-reset-button"
                  type="button"
                  onClick={handleTimerReset}
                  aria-label="I-reset ang timer"
                  title="I-reset ang timer"
                >
                  <span aria-hidden="true">↺</span> I-reset
                </button>
              )}
            </div>

            {timerFinished && (
              <motion.div
                className="timer-alert-cue"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span>Tapos na ang hakbang na ito. Handa ka na sa susunod!</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <button className="cooking-ingredients-fab" type="button" onClick={() => setDrawerOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/><path d="M6 9.01V9"/></svg>
        Mga Sangkap
      </button>

      <div className="cooking-controls">
        <button
          className="button button-secondary"
          type="button"
          disabled={stepIndex === 0}
          onClick={() => handleStepChange(Math.max(0, stepIndex - 1))}
        >
          ← Nakaraan
        </button>
        <button
          className="button button-primary"
          type="button"
          onClick={() => (stepIndex === recipe.steps.length - 1 ? setShowCompletion(true) : handleStepChange(stepIndex + 1))}
        >
          {stepIndex === recipe.steps.length - 1 ? 'Tapos na' : 'Susunod →'}
        </button>
      </div>

      <p className="cooking-note">
        Ilagay sa malapit ang iyong telepono at gamitin ang iyong pinakamahusay na pagpapasya para sa pagkakaluto at kaligtasan ng pagkain.
      </p>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} />
            <motion.div className="ingredients-drawer" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="drawer-handle" />
              <div className="drawer-header">
                <h3>Mga Sangkap</h3>
                <span className="drawer-serving-note">{recipe.servings} na serving</span>
                <button className="drawer-close-button" type="button" onClick={() => setDrawerOpen(false)}>Isara</button>
              </div>
              <ul className="drawer-ingredient-list">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className={`drawer-ingredient-item ${ing.available ? 'ingredient-available' : 'ingredient-missing'}`}>
                    <span className="drawer-ingredient-name">{ing.name}</span>
                    <span className="drawer-ingredient-qty">{ing.quantity} {ing.unit}</span>
                    <span className={`drawer-ingredient-status ${ing.available ? 'status-meron' : 'status-kulang'}`}>
                      {ing.available ? 'Meron' : 'Kulang'}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompletion && (
          <motion.div className="completion-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="completion-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}>
              <div className="completion-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B6B38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 className="completion-title">Nakatapos ka na!</h2>
              <p className="completion-dish">{recipe.title}</p>
              <p className="completion-time">Natapos sa {Math.round((Date.now() - cookingStartTime.current) / 60000)} minuto</p>
              <div className="completion-actions">
                <button className="button button-primary" type="button" onClick={onFinish}>I-save at bumalik</button>
                <button className="button button-secondary" type="button" onClick={() => { setShowCompletion(false); handleStepChange(0) }}>Ulitin mula sa simula</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
