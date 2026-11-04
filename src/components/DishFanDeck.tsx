import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

export interface FanDeckDish {
  id: string
  title: string
  category: 'classic' | 'sabaw' | 'tipid' | 'gata' | 'gulay'
  categoryLabel: string
  time: string
  price: string
  // Ingredients in the words a cook would type; tapping the card starts Ulam AI with them.
  ingredients: string
}

interface DishFanDeckProps {
  dishes: readonly FanDeckDish[]
  onSelect: (dish: FanDeckDish) => void
}

// Wider screens fan out more cards; phones show three.
const DECK_BREAKPOINTS = [
  { query: '(min-width: 1024px)', count: 6 },
  { query: '(min-width: 768px)', count: 5 },
  { query: '(min-width: 560px)', count: 4 },
] as const
const MAX_ROTATION_DEG = 12
const ARC_DROP_PX = 18

function deckSizeFor() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 6
  return DECK_BREAKPOINTS.find((breakpoint) => window.matchMedia(breakpoint.query).matches)?.count ?? 3
}

function useDeckSize() {
  const [count, setCount] = useState(deckSizeFor)
  useEffect(() => {
    const update = () => setCount(deckSizeFor())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return count
}

export function DishFanDeck({ dishes, onSelect }: DishFanDeckProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const deck = dishes.slice(0, useDeckSize())
  const mid = (deck.length - 1) / 2

  return (
    <ul className="fan-deck" aria-label="Dishes to start from">
      {deck.map((dish, index) => {
        const isActive = activeIndex === index
        // -1 at the left edge, 0 in the middle, 1 at the right edge.
        const t = mid === 0 ? 0 : (index - mid) / mid
        const transform = isActive
          ? 'translateY(-16px) rotate(0deg) scale(1.06)'
          : `translateY(${t * t * ARC_DROP_PX}px) rotate(${t * MAX_ROTATION_DEG}deg)`
        const ingredientCount = dish.ingredients.split(',').length

        return (
          <li
            key={dish.id}
            className="fan-deck-slot"
            style={{ transform, zIndex: isActive ? 50 : 10 + Math.round((1 - Math.abs(t)) * 10) }}
          >
            <button
              className={`fan-card fan-card-${dish.category}`}
              type="button"
              onClick={() => onSelect(dish)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              aria-label={`Cook ${dish.title}: start with ${dish.ingredients}`}
            >
              <span className="fan-card-top">
                <span className="fan-card-tag">{dish.categoryLabel}</span>
                <Icon className="fan-card-icon" icon="lucide:chef-hat" width={16} height={16} aria-hidden="true" />
              </span>
              <span className="fan-card-body">
                <span className="fan-card-title">{dish.title}</span>
                <span className="fan-card-meta">
                  <Icon icon="lucide:clock-3" width={13} height={13} aria-hidden="true" />
                  <span>{dish.time} · {dish.price}</span>
                </span>
              </span>
              <span className="fan-card-foot">{ingredientCount} sangkap</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
