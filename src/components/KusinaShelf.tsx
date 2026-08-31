import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { NormalizedIngredient } from '../types/domain.ts'
import { kusinaCategories, kusinaPantryItems, getSmartPairings, type KusinaCategory } from '../data/kusinaShelf.ts'

interface KusinaShelfProps {
  activeIngredients: readonly NormalizedIngredient[]
  onToggle: (name: string, isCurrentlyActive: boolean, existingId?: string) => void
}

export function KusinaShelf({ activeIngredients, onToggle }: KusinaShelfProps) {
  const [selectedCategory, setSelectedCategory] = useState<KusinaCategory['id']>('all')

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

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return kusinaPantryItems
    return kusinaPantryItems.filter((item) => item.category === selectedCategory)
  }, [selectedCategory])

  return (
    <section className="kusina-shelf" aria-label="Kitchen Pantry Quick-Add Shelf">
      <div className="shelf-header">
        <div className="shelf-title-group">
          <span className="shelf-kicker">Quick Pick</span>
          <h2 className="shelf-title">Kitchen Pantry</h2>
        </div>
        <span className="shelf-hint">Tap to add or remove</span>
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
              Pairs well with this:
            </span>
            <div className="pairings-list">
              {smartPairings.map((pair) => (
                <button
                  key={pair.localName}
                  className="pairing-chip"
                  type="button"
                  onClick={() => onToggle(pair.name, false)}
                  title={`Add ${pair.name}`}
                >
                  <span className="plus-glyph">+</span> {pair.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="shelf-tabs" role="tablist" aria-label="Kitchen Shelf Categories">
        {kusinaCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id
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
            </button>
          )
        })}
      </div>

      <motion.div layout className="shelf-grid">
        {filteredItems.map((item) => {
          const existingId = activeCanonicalMap.get(item.canonicalName.toLowerCase()) || activeCanonicalMap.get(item.localName.toLowerCase()) || activeCanonicalMap.get(item.name.toLowerCase())
          const isActive = Boolean(existingId)

          return (
            <motion.button
              layout
              key={item.name}
              className={`shelf-item-chip ${isActive ? 'item-active' : 'item-inactive'}`}
              type="button"
              onClick={() => onToggle(item.name, isActive, existingId)}
              aria-pressed={isActive}
              title={isActive ? `Remove ${item.name}` : `Add ${item.name}`}
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
              <span className="item-name">{item.name}</span>
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}

