import { useEffect, useState } from 'react'
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

export function CookingPage({ recipeId, onFinish, onBack }: CookingPageProps) {
  const { recipe } = useRecipe(recipeId)
  const { isLocked, isSupported } = useWakeLock()
  const { isSupported: isVoiceSupported, isSpeaking, stop: stopVoice, toggle: toggleVoice } = useVoiceReadout()
  const [stepIndex, setStepIndex] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerFinished, setTimerFinished] = useState(false)
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

  const handleStepChange = (newIndex: number) => {
    stopVoice()
    setTimerRunning(false)
    setTimerFinished(false)
    setTimerSeconds(0)
    setStepIndex(newIndex)
  }

  const handleTimerToggle = () => {
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

    setTimerRunning(!timerRunning)
  }

  const handleTimerReset = () => {
    setTimerRunning(false)
    setTimerFinished(false)
    setTimerSeconds(0)
  }

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
          onFinish()
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
        if (step) {
          const spokenText = `${step.action}. ${
            step.durationMinutes ? `Humigit-kumulang ${step.durationMinutes} minuto.` : ''
          } ${step.heat && step.heat !== 'none' ? `Katamtamang init: ${step.heat}.` : ''}`
          toggleVoice(spokenText)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stepIndex, recipe, timerRunning, timerSeconds, timerFinished, soundEnabled, isSpeaking, toggleVoice])

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
          {isSupported && isLocked && (
            <div
              className="cooking-wake-badge"
              title="Aktibo ang Screen Wake Lock — hindi mamamatay ang screen habang nagluluto"
              aria-label="Aktibo ang Screen Wake Lock"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="wake-badge-text">Gising ang Screen</span>
            </div>
          )}
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
                    const spokenText = `${step.action}. ${
                      step.durationMinutes ? `Humigit-kumulang ${step.durationMinutes} minuto.` : ''
                    } ${step.heat && step.heat !== 'none' ? `Katamtamang init: ${step.heat}.` : ''}`
                    toggleVoice(spokenText)
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
              <span>{step.heat && step.heat !== 'none' ? `Katamtamang init: ${step.heat}` : 'Paghahanda'}</span>
            </div>

            <div className="timer-controls-cluster">
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
          onClick={() => (stepIndex === recipe.steps.length - 1 ? onFinish() : handleStepChange(stepIndex + 1))}
        >
          {stepIndex === recipe.steps.length - 1 ? 'Tapos na' : 'Susunod →'}
        </button>
      </div>

      <div className="cooking-keyboard-hints" aria-hidden="true">
        <span className="kbd-pill"><kbd>←</kbd> <kbd>→</kbd> Hakbang</span>
        <span className="kbd-pill"><kbd>Space</kbd> Timer</span>
        <span className="kbd-pill"><kbd>V</kbd> Boses</span>
        <span className="kbd-pill"><kbd>R</kbd> Reset</span>
        <span className="kbd-pill"><kbd>M</kbd> Tunog</span>
      </div>

      <p className="cooking-note">
        Ilagay sa malapit ang iyong telepono at gamitin ang iyong pinakamahusay na pagpapasya para sa pagkakaluto at kaligtasan ng pagkain.
      </p>
    </div>
  )
}
