import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { NormalizedIngredient } from '../types/domain.ts'
import { kusinaCategories, kusinaPantryItems, getSmartPairings, type KusinaCategory, type KusinaItem } from '../data/kusinaShelf.ts'
import { useDisplayLanguage } from '../app/displayLanguage.ts'
import { getIngredientLabel, labelForName } from '../lib/ingredientLabels.ts'

function findExistingId(activeIds: Map<string, string>, item: KusinaItem) {
  return activeIds.get(item.canonicalName.toLowerCase()) || activeIds.get(item.localName.toLowerCase()) || activeIds.get(item.name.toLowerCase())
}

interface KusinaShelfProps {
  activeIngredients: readonly NormalizedIngredient[]
  onToggle: (name: string, isCurrentlyActive: boolean, existingId?: string) => void
}

export function KusinaShelf({ activeIngredients, onToggle }: KusinaShelfProps) {
  const [selectedCategory, setSelectedCategory] = useState<KusinaCategory['id']>('all')
  const language = useDisplayLanguage()

  const activeCanonicalMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const item of activeIngredients) {
      map.set(item.canonicalName.toLowerCase(), item.id)
      map.set(item.name.toLowerCase(), item.id)
    }
    return map
  }, [activeIngredients])

  const activeCanonicalNames = useMemo(() => {
    return activeIngredients.map((item) => item.canonicalName.toLowerCase())
  }, [activeIngredients])

  const smartPairings = useMemo(() => {
    return getSmartPairings(activeCanonicalNames)
  }, [activeCanonicalNames])

  const activeCountByCategory = useMemo(() => {
    const counts: Record<KusinaCategory['id'], number> = { all: 0, protina: 0, gulay: 0, pampalasa: 0 }
    for (const item of kusinaPantryItems) {
      if (!findExistingId(activeCanonicalMap, item)) continue
      counts.all += 1
      counts[item.category] += 1
    }
    return counts
  }, [activeCanonicalMap])

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return kusinaPantryItems
    return kusinaPantryItems.filter((item) => item.category === selectedCategory)
  }, [selectedCategory])

  return (
    <section className="kusina-shelf" aria-labelledby="pantry-heading">
      <div className="shelf-header">
        <div className="shelf-title-group">
          <h2 className="shelf-title" id="pantry-heading">Pantry</h2>
        </div>
      </div>

      <AnimatePresence>
        {smartPairings.length > 0 && (
          <motion.div
            className="smart-pairings-bar"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <span className="pairings-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Goes well with
            </span>
            <div className="pairings-list">
              {smartPairings.map((pair) => (
                <button
                  key={pair.localName}
                  className="pairing-chip"
                  type="button"
                  onClick={() => onToggle(pair.name, false)}
                  aria-label={`Add ${labelForName(pair.name, language)}`}
                >
                  <span className="plus-glyph" aria-hidden="true">+</span> {getIngredientLabel(pair.name, pair.localName, language).primary}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="shelf-tabs" role="tablist" aria-label="Kitchen Shelf Categories">
        {kusinaCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id
          const count = activeCountByCategory[cat.id]
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              className={`shelf-tab ${isSelected ? 'tab-active' : ''}`}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
              {count > 0 ? <span className="shelf-tab-count" aria-label={`${count} selected`}>{count}</span> : null}
            </button>
          )
        })}
      </div>

      <motion.div layout className="shelf-grid">
        {filteredItems.map((item) => {
          const existingId = findExistingId(activeCanonicalMap, item)
          const isActive = Boolean(existingId)
          const label = getIngredientLabel(item.name, item.localName, language)

          return (
            <motion.button
              layout
              key={item.name}
              className={`shelf-item-chip ${isActive ? 'item-active' : 'item-inactive'}`}
              type="button"
              onClick={() => onToggle(item.name, isActive, existingId)}
              aria-pressed={isActive}
              aria-label={`${isActive ? 'Remove' : 'Add'} ${label.secondary ? `${label.primary} (${label.secondary})` : label.primary}`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="chip-indicator" aria-hidden="true">
                {isActive ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </span>
              <span className="item-emoji" aria-hidden="true">{item.emoji}</span>
              <span className="item-name">
                {label.primary}
                {label.secondary ? <small>{label.secondary}</small> : null}
              </span>
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}

