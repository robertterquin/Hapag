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
    badge: 'Classic Ulam',
    authenticity: 'Lutong Bahay',
    matchScore: 96,
    time: '35 mins',
    difficulty: 'Easy',
    price: '₱140 – ₱190',
    servings: '4 servings',
    available: ['Manok', 'Patatas', 'Bawang', 'Toyo'],
    missing: ['Suka'],
    subTip: 'Can substitute Potatoes with Tofu',
  },
  {
    id: 'sinigang',
    title: 'Sinigang na Baboy',
    localName: 'Sinigang sa Sampalok',
    description: 'Pork belly simmered in a tangy tamarind broth with fresh kangkong and crisp vegetables.',
    badge: 'Classic Ulam',
    authenticity: 'Sabaw',
    matchScore: 88,
    time: '50 mins',
    difficulty: 'Medium',
    price: '₱220 – ₱300',
    servings: '4 servings',
    available: ['Liempo', 'Kangkong', 'Kamatis', 'Sibuyas'],
    missing: ['Sampalok', 'Labanos'],
    subTip: 'Can substitute Sampalok with Calamansi',
  },
  {
    id: 'torta',
    title: 'Tortang Talong',
    localName: 'Torta ng Talong',
    description: 'Charred smoky eggplant dipped in savory beaten egg and pan-fried until golden crisp.',
    badge: 'Classic Ulam',
    authenticity: 'Mabilis & Tipid',
    matchScore: 100,
    time: '20 mins',
    difficulty: 'Easy',
    price: '₱60 – ₱90',
    servings: '2 servings',
    available: ['Talong', 'Itlog', 'Bawang', 'Asin'],
    missing: [],
    subTip: 'Add ground pork or onion for extra flavor',
  },
  {
    id: 'tinola',
    title: 'Chicken Tinola',
    localName: 'Tinolang Manok na may Sayote',
    description: 'Nourishing ginger chicken soup infused with fresh chayote and tender chili leaves.',
    badge: 'Classic Ulam',
    authenticity: 'Pampagaling',
    matchScore: 92,
    time: '40 mins',
    difficulty: 'Easy',
    price: '₱160 – ₱220',
    servings: '4 servings',
    available: ['Manok', 'Luya', 'Bawang', 'Sibuyas'],
    missing: ['Sayote', 'Dahon ng Sili'],
    subTip: 'Can substitute Chili Leaves with Malunggay',
  },
]

export function HomePage({ onStart }: HomePageProps) {
  const [cards, setCards] = useState<PreviewCardData[]>(PREVIEW_CARDS)

  const handleShuffle = () => {
    setCards((prev) => [...prev.slice(1), prev[0]])
  }

  const currentDishIndex = PREVIEW_CARDS.findIndex((c) => c.id === cards[0].id) + 1

  return (
    <div className="page-shell page-shell-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Filipino meal assistant</span>
          <h1>May sangkap ka? May maluluto tayo.</h1>
          <p className="hero-subtitle">Mula sa kusina mo, hanap tayo ng ulam.</p>
          <p className="hero-description">Ilagay ang mga sangkap na meron ka, suriin ang nakita ni Hapag, at iangkop ang mga ideya sa budget, servings, at panlasang gusto mo.</p>
          <div className="home-cta-content">
            <strong>Tuklasin ang ulam na bagay sa iyo.</strong>
            <p>Sa Ulam AI, ilalagay mo ang mga sangkap mo, pipili ng preferences, at makakakita ng tatlong praktikal na ideya.</p>
            <button className="button button-primary" type="button" onClick={() => onStart('')}>Simulan sa Ulam AI <span aria-hidden="true">→</span></button>
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
            aria-label="I-click para mag-shuffle ng recipe card"
          >
            {cards.slice(0, 3).map((dish, index) => {
              const isTop = index === 0
              return (
                <motion.div
                  key={dish.id}
                  className={`hero-preview-card card-stack-item ${isTop ? 'card-stack-top' : `card-stack-bg card-stack-bg-${index}`}`}
                  style={{ zIndex: 3 - index }}
                  animate={{
                    scale: 1 - index * 0.045,
                    y: index * -14,
                    opacity: 1 - index * 0.18,
                    rotate: index === 0 ? 0 : index === 1 ? 2.2 : -2.2,
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
                        <span className="hero-preview-group-label meron">Meron ka na ({dish.available.length})</span>
                        <div className="hero-preview-chips">
                          {dish.available.map((item) => (
                            <span key={item} className="chip-meron">{item}</span>
                          ))}
                        </div>
                      </div>

                      {dish.missing.length > 0 && (
                        <div className="hero-preview-group">
                          <span className="hero-preview-group-label kulang">Kulang pa ({dish.missing.length})</span>
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
                        <span className="sub-tip-badge">Pamalit</span>
                        <span className="sub-tip-text">{dish.subTip}</span>
                      </div>
                    )}

                    {isTop && (
                      <div className="card-stack-footer-prompt">
                        <span className="card-shuffle-hint">
                          <span className="shuffle-icon" aria-hidden="true">↻</span>
                          I-click para mag-shuffle ({currentDishIndex}/{PREVIEW_CARDS.length})
                        </span>
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

