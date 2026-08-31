import { useState } from 'react'
import { motion } from 'motion/react'

export interface HomePageProps {
  onStart: (value: string) => void
}

interface PreviewCardData {
  id: string
  title: string
  localName: string
  description: string
  badge: string
  authenticity: string
  matchScore: number
  time: string
  difficulty: string
  price: string
  servings: string
  available: string[]
  missing: string[]
  subTip?: string
}

const PREVIEW_CARDS: PreviewCardData[] = [
  {
    id: 'adobo',
    title: 'Classic Chicken Adobo',
    localName: 'Adobong Manok na may Patatas',
    description: 'Classic Filipino chicken braised in savory soy sauce and vinegar with crisp garlic and potatoes.',
    badge: 'Classic Dish',
    authenticity: 'Home-style',
    matchScore: 96,
    time: '35 mins',
    difficulty: 'Easy',
    price: '₱140 – ₱190',
    servings: '4 servings',
    available: ['Chicken', 'Potatoes', 'Garlic', 'Soy Sauce'],
    missing: ['Vinegar'],
    subTip: 'Can substitute Potatoes with Tofu',
  },
  {
    id: 'sinigang',
    title: 'Pork Sinigang',
    localName: 'Sinigang sa Sampalok',
    description: 'Pork belly simmered in a tangy tamarind broth with fresh kangkong and crisp vegetables.',
    badge: 'Classic Dish',
    authenticity: 'Sour Soup',
    matchScore: 88,
    time: '50 mins',
    difficulty: 'Medium',
    price: '₱220 – ₱300',
    servings: '4 servings',
    available: ['Pork Belly', 'Kangkong', 'Tomatoes', 'Onion'],
    missing: ['Tamarind', 'Radish'],
    subTip: 'Can substitute Tamarind with Calamansi',
  },
  {
    id: 'torta',
    title: 'Tortang Talong',
    localName: 'Torta ng Talong',
    description: 'Charred smoky eggplant dipped in savory beaten egg and pan-fried until golden crisp.',
    badge: 'Classic Dish',
    authenticity: 'Pan-fried',
    matchScore: 100,
    time: '20 mins',
    difficulty: 'Easy',
    price: '₱60 – ₱90',
    servings: '2 servings',
    available: ['Eggplant', 'Eggs', 'Garlic', 'Salt'],
    missing: [],
    subTip: 'Add ground pork or onion for extra flavor',
  },
  {
    id: 'tinola',
    title: 'Chicken Tinola',
    localName: 'Tinolang Manok na may Sayote',
    description: 'Traditional ginger chicken soup simmered with fresh chayote and tender chili leaves.',
    badge: 'Classic Dish',
    authenticity: 'Ginger Soup',
    matchScore: 92,
    time: '40 mins',
    difficulty: 'Easy',
    price: '₱160 – ₱220',
    servings: '4 servings',
    available: ['Chicken', 'Ginger', 'Garlic', 'Onion'],
    missing: ['Chayote', 'Chili Leaves'],
    subTip: 'Can substitute Chili Leaves with Malunggay / Moringa',
  },
]

export function HomePage({ onStart }: HomePageProps) {
  const [cards, setCards] = useState<PreviewCardData[]>(PREVIEW_CARDS)

  const handleShuffle = () => {
    setCards((prev) => [...prev.slice(1), prev[0]])
  }

  return (
    <div className="page-shell page-shell-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Filipino meal assistant</span>
          <h1>Got ingredients? Let's cook something delicious.</h1>
          <p className="hero-subtitle">From your kitchen pantry to the dinner table.</p>
          <p className="hero-description">Enter whatever ingredients you have on hand. Hapag analyzes them to find authentic Filipino recipes, complete with price estimates, smart substitutions, and step-by-step guidance.</p>
          <div className="home-cta-content">
            <strong>Discover dishes tailored to you.</strong>
            <p>With Ulam AI, input your available ingredients, set preferences, and explore 3 practical meal options.</p>
            <button className="button button-primary" type="button" onClick={() => onStart('')}>Start with Ulam AI <span aria-hidden="true">→</span></button>
          </div>
        </div>

        <div className="hero-preview-wrapper" aria-label="Interactive Stacked Recipe Cards">
          <div
            className="card-stack-container"
            onClick={handleShuffle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleShuffle()
              }
            }}
            aria-label="Click to shuffle recipe card"
          >
            {cards.slice(0, 3).map((dish, index) => {
              const isTop = index === 0
              return (
                <motion.div
                  key={dish.id}
                  className={`hero-preview-card card-stack-item ${isTop ? 'card-stack-top' : `card-stack-bg card-stack-bg-${index}`}`}
                  style={{ zIndex: 3 - index }}
                  animate={{
                    scale: index === 0 ? 1 : index === 1 ? 0.96 : 0.92,
                    y: index === 0 ? 0 : index === 1 ? -16 : -30,
                    x: index === 0 ? 0 : index === 1 ? 8 : -6,
                    rotate: index === 0 ? 0 : index === 1 ? 2.5 : -2,
                    opacity: index === 0 ? 1 : index === 1 ? 0.9 : 0.72,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 24,
                  }}
                  whileHover={isTop ? { y: -4, scale: 1.01 } : {}}
                  whileTap={isTop ? { scale: 0.98 } : {}}
                >
                  <div className="hero-preview-topline">
                    <div className="hero-preview-tags">
                      <span className="hero-preview-badge">{dish.badge}</span>
                      <span className="hero-preview-authenticity">{dish.authenticity}</span>
                    </div>
                    <span className="hero-preview-match">{dish.matchScore}% Match</span>
                  </div>

                  <div className="hero-preview-body">
                    <div className="hero-preview-header">
                      <h3 className="hero-preview-title">{dish.title}</h3>
                      <span className="hero-preview-local-name">{dish.localName}</span>
                    </div>

                    <p className="hero-preview-desc">{dish.description}</p>

                    <div className="hero-preview-metrics">
                      <span className="metric-pill">{dish.time}</span>
                      <span className="metric-pill">{dish.difficulty}</span>
                      <span className="metric-pill metric-price">{dish.price}</span>
                      <span className="metric-pill">{dish.servings}</span>
                    </div>

                    <div className="hero-preview-ingredients">
                      <div className="hero-preview-group">
                        <span className="hero-preview-group-label meron">You Have ({dish.available.length})</span>
                        <div className="hero-preview-chips">
                          {dish.available.map((item) => (
                            <span key={item} className="chip-meron">{item}</span>
                          ))}
                        </div>
                      </div>

                      {dish.missing.length > 0 && (
                        <div className="hero-preview-group">
                          <span className="hero-preview-group-label kulang">Missing ({dish.missing.length})</span>
                          <div className="hero-preview-chips">
                            {dish.missing.map((item) => (
                              <span key={item} className="chip-kulang">{item}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {dish.subTip && (
                      <div className="hero-preview-sub-tip">
                        <span className="sub-tip-badge">Substitution</span>
                        <span className="sub-tip-text">{dish.subTip}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}


