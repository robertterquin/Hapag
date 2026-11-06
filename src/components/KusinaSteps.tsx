import { motion } from 'motion/react'
import { KUSINA_STEP_NAMES, KUSINA_STEPS, kusinaProgress } from '../lib/kusinaProgress.ts'
import { AI_TIMEOUT_MS } from '../lib/aiTimeout.ts'

export function KusinaSteps({ elapsedMs }: { elapsedMs: number }) {
  const { active, aiShare, late } = kusinaProgress(elapsedMs)
  const seconds = Math.round(AI_TIMEOUT_MS / 1000)

  return (
    <div className="kusina-steps">
      <ol className="kusina-steps-track" aria-hidden="true">
        {KUSINA_STEPS.map((step, i) => (
          <li key={step} className={i < active ? 'is-done' : i === active ? 'is-active' : ''}>
            {/* The line leading into this step: full once reached; the one after "Write" fills with the AI's time. */}
            {i > 0 ? (
              <span className="kusina-step-line">
                <motion.span
                  className="kusina-step-fill"
                  initial={false}
                  animate={{ scaleX: i <= active ? 1 : i === active + 1 && active === 2 ? aiShare : 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </span>
            ) : null}
            <span className="kusina-step-dot" />
            <span className="kusina-step-name">{KUSINA_STEP_NAMES[i]}</span>
          </li>
        ))}
      </ol>
      <p className="kusina-steps-label">
        <strong>{active + 1} of {KUSINA_STEPS.length}</strong> · {KUSINA_STEPS[active]}…
      </p>
      <p className="kusina-steps-time">{late ? 'Almost there…' : `This can take up to ${seconds} seconds.`}</p>
      <span className="sr-only" role="status">Step {active + 1} of {KUSINA_STEPS.length}: {KUSINA_STEPS[active]}</span>
    </div>
  )
}
