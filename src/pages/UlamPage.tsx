import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { IngredientAddForm } from '../components/IngredientAddForm.tsx'
import { IngredientChips } from '../components/IngredientChips.tsx'
import { KusinaShelf } from '../components/KusinaShelf.tsx'
import { ServingStepper } from '../components/ServingStepper.tsx'
import { countRecipeMatches } from '../services/recipeMatcher.ts'
import type { DiscoverySession, GenerationConstraints, IngredientDraft } from '../types/domain.ts'

export interface UlamPageProps {
  session: DiscoverySession
  onAddIngredients: (input: IngredientDraft) => void
  onReset: () => void
  onUpdateConstraints: (patch: Partial<GenerationConstraints>) => void
  onGenerate: () => void
  onRemove: (id: string) => void
}

export function UlamPage({ session, onAddIngredients, onReset, onUpdateConstraints, onGenerate, onRemove }: UlamPageProps) {
  const [constraintsOpen, setConstraintsOpen] = useState(false)

  const handleKusinaToggle = (name: string, isCurrentlyActive: boolean, existingId?: string) => {
    if (isCurrentlyActive && existingId) {
      onRemove(existingId)
    } else {
      onAddIngredients({ name })
    }
  }

  const matchCount = useMemo(() => {
    return countRecipeMatches(session.ingredients)
  }, [session.ingredients])

  const constraintsSummary = useMemo(() => {
    const parts: string[] = []
    parts.push(`${session.constraints.servings} serv.`)
    if (session.constraints.budgetLimit) parts.push(`< ₱${session.constraints.budgetLimit}`)
    if (session.constraints.dietaryPreference && session.constraints.dietaryPreference !== 'none') {
      parts.push(session.constraints.dietaryPreference)
    }
    parts.push(session.constraints.spiceLevel === 'mild' ? 'Mild' : session.constraints.spiceLevel === 'medium' ? 'Medium' : 'Maanghang')
    return parts
  }, [session.constraints])

  return (
    <div className="page-shell narrow-page">
      <span className="eyebrow">Ulam AI</span>
      <h1>Start with what you have.</h1>
      <p className="page-intro">Sabihin kay Hapag kung anong sangkap ang meron ka, saka pumili ng lulutuin.</p>

      {/* Manual Input Form */}
      <IngredientAddForm
        idPrefix="ulam-add"
        label="Magdagdag ng sangkap"
        helper="Magdagdag ng isa o higit pang sangkap gamit ang kuwit o Enter."
        submitLabel="Idagdag"
        placeholder="hal. 1/2 kg manok, patatas, bawang, toyo"
        onSubmit={async (input) => { onAddIngredients(input) }}
      />

      {/* 1-Tap Kusina Shelf (Smart Nearby Sangkap Picker) */}
      <KusinaShelf
        activeIngredients={session.ingredients}
        onToggle={handleKusinaToggle}
      />

      {session.ingredients.length > 0 ? (
        <button className="text-button ulam-reset-button" type="button" onClick={onReset}>
          Magsimula ng bagong listahan
        </button>
      ) : null}

      {/* Active Ingredients Review */}
      <section className="review-panel" aria-labelledby="review-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">Pagsusuri ng sangkap</span>
            <h2 id="review-heading">Ito ang mga sangkap na nakita ko:</h2>
          </div>
          <span className="count-badge">{session.ingredients.length}</span>
        </div>
        <IngredientChips ingredients={session.ingredients} onRemove={onRemove} />
        {session.ingredients.some((ingredient) => ingredient.confidence === 'low') ? (
          <p className="inline-warning">May sangkap na kailangang suriin. Pakisuri bago bumuo ng mga ideya.</p>
        ) : null}
      </section>

      {/* Collapsible Constraints Panel */}
      <section className="constraints-panel" aria-labelledby="constraints-heading">
        <button
          className="constraints-toggle"
          type="button"
          onClick={() => setConstraintsOpen((prev) => !prev)}
          aria-expanded={constraintsOpen}
          aria-controls="constraints-body"
        >
          <div className="constraints-toggle-left">
            <span className="section-kicker">Mga opsyonal na preference</span>
            <h2 id="constraints-heading">Iangkop natin sa bahay mo.</h2>
          </div>
          <span className={`constraints-chevron ${constraintsOpen ? 'chevron-open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
        {!constraintsOpen && (
          <div className="constraints-summary-pills">
            {constraintsSummary.map((pill) => (
              <span key={pill} className="constraint-pill">{pill}</span>
            ))}
          </div>
        )}
        <AnimatePresence initial={false}>
          {constraintsOpen && (
            <motion.div
              id="constraints-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="constraint-grid">
                <ServingStepper value={session.constraints.servings} onChange={(value) => onUpdateConstraints({ servings: value })} />
                <label className="field-label">
                  Budget limit
                  <select value={session.constraints.budgetLimit ?? ''} onChange={(event) => onUpdateConstraints({ budgetLimit: event.target.value ? Number(event.target.value) : undefined })}>
                    <option value="">Kahit anong budget</option>
                    <option value="100">Mas mababa sa ₱100</option>
                    <option value="200">Mas mababa sa ₱200</option>
                  </select>
                </label>
                <label className="field-label">
                  Dietary preference
                  <select value={session.constraints.dietaryPreference ?? 'none'} onChange={(event) => onUpdateConstraints({ dietaryPreference: event.target.value as GenerationConstraints['dietaryPreference'] })}>
                    <option value="none">Wala</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="low-sodium">Low-sodium guidance</option>
                    <option value="diabetic-friendly">Diabetic-friendly guidance</option>
                  </select>
                </label>
                <label className="field-label">
                  Spice level
                  <select value={session.constraints.spiceLevel} onChange={(event) => onUpdateConstraints({ spiceLevel: event.target.value as GenerationConstraints['spiceLevel'] })}>
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Maanghang</option>
                  </select>
                </label>
              </div>
              <div className="allergy-callout">
                <strong>May allergy ka ba?</strong>
                <span>Palaging tingnan ang labels at mag-ingat sa cross-contact. Hindi magagarantiya ng Hapag ang kaligtasan para sa may allergy.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Live Match Counter + CTA */}
      <div className="ulam-cta-section">
        <AnimatePresence mode="wait">
          {session.ingredients.length > 0 && (
            <motion.div
              className="match-counter"
              key={matchCount}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" />
                <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" /><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
              </svg>
              <span>
                <strong>{matchCount}</strong> {matchCount === 1 ? 'recipe ang tugma' : 'na recipe ang tugma'} sa {session.ingredients.length} {session.ingredients.length === 1 ? 'sangkap' : 'na sangkap'} mo
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button className="button button-primary full-width" type="button" onClick={onGenerate} disabled={session.ingredients.length === 0}>
          Lutuin natin!
        </button>
      </div>
    </div>
  )
}

