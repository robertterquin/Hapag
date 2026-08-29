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
    const map = new Map<string, string>() // canonicalName -> id
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
    <section className="kusina-shelf" aria-label="Sangkap sa Kusina Quick-Add Shelf">
      <div className="shelf-header">
        <div className="shelf-title-group">
          <span className="shelf-kicker">Mabilisang Pagpili</span>
          <h2 className="shelf-title">Sangkap sa Kusina</h2>
        </div>
        <span className="shelf-hint">I-tap para idagdag o alisin</span>
      </div>

      {/* Dynamic Smart Pairings */}
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
              Bagay isahog kasama nito:
            </span>
            <div className="pairings-list">
              {smartPairings.map((pair) => (
                <button
                  key={pair.localName}
                  className="pairing-chip"
                  type="button"
                  onClick={() => onToggle(pair.localName, false)}
                  title={`Idagdag ang ${pair.localName}`}
                >
                  <span className="plus-glyph">+</span> {pair.localName}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div className="shelf-tabs" role="tablist" aria-label="Kusina Shelf Categories">
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

      {/* Shelf Grid / Chips */}
      <motion.div layout className="shelf-grid">
        {filteredItems.map((item) => {
          const existingId = activeCanonicalMap.get(item.canonicalName.toLowerCase()) || activeCanonicalMap.get(item.localName.toLowerCase())
          const isActive = Boolean(existingId)

          return (
            <motion.button
              layout
              key={item.localName}
              className={`shelf-item-chip ${isActive ? 'item-active' : 'item-inactive'}`}
              type="button"
              onClick={() => onToggle(item.localName, isActive, existingId)}
              aria-pressed={isActive}
              title={isActive ? `Alisin ang ${item.localName}` : `Idagdag ang ${item.localName}`}
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
              <span className="item-name">{item.localName}</span>
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}
