import { useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { DishImage } from '../components/DishImage.tsx'
import { HaveProgress } from '../components/HaveProgress.tsx'
import { IngredientChip } from '../components/IngredientChip.tsx'
import { useDisplayLanguage } from '../app/displayLanguage.ts'
import { labelForName } from '../lib/ingredientLabels.ts'

export interface HomePageProps {
  onStart: (value: string) => void
  onSurprise: () => void
}

const EXAMPLE_COMBOS = [
  { label: '🥚 Itlog + 🍅 Kamatis', value: 'itlog, kamatis' },
  { label: '🍗 Manok + 🧄 Bawang + Toyo', value: 'manok, bawang, toyo, suka' },
  { label: '🥫 Sardinas + 🥬 Pechay', value: 'sardinas, pechay, itlog' },
  { label: '🍆 Talong + 🥚 Itlog', value: 'talong, itlog' },
] as const

// Sample results that mirror the real results cards. Ingredient names are canonical (English)
// and rendered in the display language; photos come from the verified dish photo set.
interface PreviewCardData {
  id: string
  title: string
  localName: string
  description: string
  badge: string
  time: string
  difficulty: string
  price: string
  servings: string
  have: string[]
  toBuy: string[]
  staples: string[]
}

const PREVIEW_CARDS: PreviewCardData[] = [
  {
    id: 'chicken-adobo',
    title: 'Chicken Adobo',
    localName: 'Adobong Manok',
    description: 'Chicken braised in soy sauce and vinegar with plenty of garlic.',
    badge: 'Classic dish',
    time: '35 min',
    difficulty: 'Easy',
    price: '₱140–₱190',
    servings: '4 servings',
    have: ['chicken', 'soy sauce', 'garlic'],
    toBuy: [],
    staples: ['vinegar', 'black pepper'],
  },
  {
    id: 'sinigang-na-baboy',
    title: 'Sinigang na Baboy',
    localName: 'Pork Sinigang',
    description: 'Pork in a sour tamarind broth with kangkong and tomatoes.',
    badge: 'Sour soup',
    time: '50 min',
    difficulty: 'Medium',
    price: '₱220–₱300',
    servings: '4 servings',
    have: ['pork', 'tomato', 'water spinach'],
    toBuy: ['tamarind'],
    staples: ['onion'],
  },
  {
    id: 'tortang-talong',
    title: 'Tortang Talong',
    localName: 'Eggplant Omelette',
    description: 'Smoky charred eggplant dipped in egg and pan-fried until golden.',
    badge: 'Budget meal',
    time: '20 min',
    difficulty: 'Easy',
    price: '₱60–₱90',
    servings: '2 servings',
    have: ['eggplant', 'egg'],
    toBuy: [],
    staples: ['garlic', 'oil'],
  },
  {
    id: 'tinolang-manok',
    title: 'Tinolang Manok',
    localName: 'Chicken Tinola',
    description: 'Gingery chicken soup with green papaya and leafy greens.',
    badge: 'Comfort soup',
    time: '40 min',
    difficulty: 'Easy',
    price: '₱160–₱220',
    servings: '4 servings',
    have: ['chicken', 'ginger'],
    toBuy: ['green papaya'],
    staples: ['onion', 'fish sauce'],
  },
]

const HOW_IT_WORKS = [
  { icon: 'lucide:shopping-basket', title: 'Add what you have', detail: 'Type it or tap it from the pantry.' },
  { icon: 'lucide:utensils', title: 'Pick a dish', detail: 'See what you have and what to buy.' },
  { icon: 'lucide:chef-hat', title: 'Cook step by step', detail: 'With timers and read-aloud steps.' },
] as const

export function HomePage({ onStart, onSurprise }: HomePageProps) {
  const language = useDisplayLanguage()
  const [cards, setCards] = useState<PreviewCardData[]>(PREVIEW_CARDS)

  const handleShuffle = () => {
    setCards((prev) => [...prev.slice(1), prev[0]])
  }

  return (
    <div className="page-shell page-shell-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Filipino meal assistant</span>
          <h1>Ano'ng ulam?</h1>
          <p className="hero-subtitle">Tell us what's in your kusina. We'll find Filipino dishes you can cook.</p>
          <div className="home-actions">
            <button className="button button-primary home-start-button" type="button" onClick={() => onStart('')}>
              Start with Ulam AI <span aria-hidden="true">→</span>
            </button>
            <button className="button button-secondary home-surprise-button" type="button" onClick={onSurprise}>
              <Icon icon="lucide:dices" width={18} height={18} aria-hidden="true" /> Surprise me!
            </button>
          </div>
          <div className="home-examples">
            <span className="home-examples-label" id="home-examples-label">Or start from a classic combo</span>
            <div className="home-examples-grid" role="group" aria-labelledby="home-examples-label">
              {EXAMPLE_COMBOS.map((combo) => (
                <button key={combo.value} className="suggestion-chip" type="button" onClick={() => onStart(combo.value)}>{combo.label}</button>
              ))}
            </div>
          </div>
          <ol className="home-steps" aria-label="How Hapag works">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.title}>
                <span className="home-step-icon" aria-hidden="true"><Icon icon={step.icon} width={20} height={20} /></span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.detail}</small>
                </span>
              </li>
            ))}
          </ol>
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
            aria-label="Sample result. Press to see another dish"
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
                  <DishImage recipe={{ id: dish.id, title: dish.title, localTitle: dish.localName }} variant="card" />
                  <div className="hero-preview-content">
                    <span className="recipe-badge">{dish.badge}</span>
                    <HaveProgress have={dish.have.length} total={dish.have.length + dish.toBuy.length} />
                    <h3 className="hero-preview-title">{dish.title}</h3>
                    <span className="hero-preview-local-name">{dish.localName}</span>
                    <div className="recipe-metrics hero-preview-metrics">
                      <span className="metric-price">{dish.price}</span>
                      <span>{dish.time}</span>
                      <span>{dish.difficulty}</span>
                      <span>{dish.servings}</span>
                    </div>
                    <p className="hero-preview-desc">{dish.description}</p>
                    <div className="ingredient-summary">
                      <div><strong>You have ({dish.have.length})</strong>{dish.have.map((item) => <IngredientChip key={item} name={labelForName(item, language)} variant="have" />)}</div>
                      {dish.toBuy.length > 0 ? <div><strong>To buy ({dish.toBuy.length})</strong>{dish.toBuy.map((item) => <IngredientChip key={item} name={labelForName(item, language)} variant="missing" />)}</div> : null}
                      {dish.staples.length > 0 ? <div><strong>Probably in your kusina</strong>{dish.staples.map((item) => <IngredientChip key={item} name={labelForName(item, language)} variant="staple" />)}</div> : null}
                    </div>
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


