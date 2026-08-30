import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getAutocompleteSuggestions } from '../lib/ingredientParser.ts'

interface IngredientAutocompleteProps {
  query: string
  onSelect: (value: string) => void
  onClose: () => void
  visible: boolean
}

export function IngredientAutocomplete({
  query,
  onSelect,
  onClose,
  visible,
}: IngredientAutocompleteProps) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const suggestions = getAutocompleteSuggestions(query)
  const isVisible = visible && suggestions.length > 0 && query.trim().length > 0

  useEffect(() => {
    setActiveIndex(-1)
  }, [query, isVisible])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isVisible) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        onSelect(suggestions[activeIndex].alias)
        onClose()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, activeIndex, suggestions, onSelect, onClose])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isVisible, onClose])

  return (
    <div className="autocomplete-wrapper" ref={dropdownRef}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="autocomplete-dropdown"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {suggestions.map((suggestion, idx) => (
              <div
                key={suggestion.canonical}
                className={`autocomplete-item ${idx === activeIndex ? 'active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSelect(suggestion.alias)
                  onClose()
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="autocomplete-item-name">{suggestion.display}</span>
                <span className="autocomplete-item-canonical">{suggestion.canonical}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

