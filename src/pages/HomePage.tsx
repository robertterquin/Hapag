import type { ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { DishFanDeck } from '../components/DishFanDeck.tsx'
import type { FanDeckDish } from '../components/DishFanDeck.tsx'
import { DishImage } from '../components/DishImage.tsx'
import { HaveProgress } from '../components/HaveProgress.tsx'
import { IngredientChip } from '../components/IngredientChip.tsx'
import { useDisplayLanguage } from '../app/displayLanguage.ts'
import { labelForName } from '../lib/ingredientLabels.ts'

export interface HomePageProps {
  onStart: (value: string) => void
  onSurprise: () => void
}

// Each card's ingredients match its own dish first in the catalog, so a tap leads straight to it.
const DECK_DISHES: readonly FanDeckDish[] = [
  { id: 'chicken-adobo', title: 'Adobong Manok', category: 'classic', categoryLabel: 'Classic', time: '35 min', price: '₱140', ingredients: 'manok, bawang, toyo, suka' },
  { id: 'sinigang-na-baboy', title: 'Sinigang na Baboy', category: 'sabaw', categoryLabel: 'Sabaw', time: '50 min', price: '₱220', ingredients: 'baboy, sampalok, kamatis, sibuyas, kangkong' },
  { id: 'tortang-talong', title: 'Tortang Talong', category: 'tipid', categoryLabel: 'Tipid', time: '20 min', price: '₱60', ingredients: 'talong, itlog, bawang, sibuyas' },
  { id: 'ginataang-kalabasa-at-sitaw', title: 'Ginataang Kalabasa at Sitaw', category: 'gata', categoryLabel: 'Gata', time: '30 min', price: '₱90', ingredients: 'kalabasa, sitaw, gata, bawang' },
  { id: 'tinolang-manok', title: 'Tinolang Manok', category: 'sabaw', categoryLabel: 'Sabaw', time: '40 min', price: '₱160', ingredients: 'manok, luya, sibuyas, papaya' },
  { id: 'ginisang-monggo', title: 'Ginisang Monggo', category: 'gulay', categoryLabel: 'Gulay', time: '45 min', price: '₱70', ingredients: 'monggo, kamatis, bawang, sibuyas' },
]

const PRINCIPLES = [
  { icon: 'lucide:coins', title: 'Prices in pesos', text: 'Palengke estimates for every ingredient, so you know the cost before you go to the market.' },
  { icon: 'lucide:utensils-crossed', title: 'Real Filipino dishes', text: "Suggestions come from a 150-dish catalog of ulam you already know. No made-up fusion recipes." },
  { icon: 'lucide:shopping-basket', title: 'Starts from what you have', text: 'Type in English, Tagalog, or Taglish. Anything missing goes on a shopping list you can share.' },
] as const

function PreviewFrame({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`preview-frame ${className}`}>
      <div className="preview-frame-bar" aria-hidden="true">
        <span /><span /><span />
        <small>{label}</small>
      </div>
      <div className="preview-frame-body" aria-hidden="true">{children}</div>
      <figcaption className="sr-only">{label} preview</figcaption>
    </figure>
  )
}

function StepCopy({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="how-step-copy">
      <span className="how-step-number">{n}</span>
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export function HomePage({ onStart, onSurprise }: HomePageProps) {
  const language = useDisplayLanguage()
  const label = (name: string) => labelForName(name, language)

  return (
    <div className="page-shell page-shell-home">
      <section className="home-hero" aria-labelledby="home-heading">
        <h1 id="home-heading">
          Ano'ng ulam? <span className="home-hero-line">Cook from your <em>kusina</em>.</span>
        </h1>
        <p className="home-hero-lede">
          Tell Hapag what you have. It finds Filipino dishes you can cook today, with peso prices and steps you can follow.
        </p>
        <div className="home-actions">
          <button className="button button-primary home-start-button" type="button" onClick={() => onStart('')}>
            Start with Ulam AI
          </button>
          <button className="home-ghost-button" type="button" onClick={onSurprise}>
            Surprise me! <Icon icon="lucide:arrow-right" width={16} height={16} aria-hidden="true" />
          </button>
        </div>

        <div className="home-deck">
          <DishFanDeck dishes={DECK_DISHES} onSelect={(dish) => onStart(dish.ingredients)} />
          <p className="home-deck-hint">Tap a dish to cook with its ingredients.</p>
        </div>
      </section>

      <section className="home-section home-how" aria-labelledby="how-heading">
        <div className="home-section-intro">
          <h2 id="how-heading">How it <em>works</em></h2>
          <p>No more staring into the ref. Three steps from "ano'ng meron?" to dinner on the table.</p>
        </div>

        <div className="how-row">
          <StepCopy n={1} title="Tell Hapag what's in your kusina">
            <p>Type what you have the way you'd say it: "1/2 kg manok, bawang, toyo." Or tap it from the pantry shelf.</p>
            <p>Your usual staples, like garlic, onion, and oil, are one tap away.</p>
          </StepCopy>
          <PreviewFrame label="Ulam AI">
            <div className="preview-input">
              <Icon icon="lucide:search" width={16} height={16} />
              <span>1/2 kg manok, bawang, toyo, suka</span>
            </div>
            <div className="preview-chip-row">
              {['chicken', 'garlic', 'soy sauce', 'vinegar'].map((item) => <IngredientChip key={item} name={label(item)} variant="have" />)}
            </div>
            <div className="preview-cook-bar">
              <span>4 sangkap ready</span>
              <span className="preview-fake-button">Let's cook →</span>
            </div>
          </PreviewFrame>
        </div>

        <div className="how-row how-row-reverse">
          <StepCopy n={2} title="See what you have and what to buy">
            <p>Every dish shows what you already have, what's missing, how long it takes, and what it costs.</p>
            <p>Missing ingredients turn into a shopping list with peso estimates.</p>
          </StepCopy>
          <PreviewFrame label="Results">
            <div className="preview-recipe">
              <DishImage recipe={{ id: 'sinigang-na-baboy', title: 'Sinigang na Baboy', localTitle: 'Pork Sinigang' }} variant="card" />
              <div className="preview-recipe-body">
                <HaveProgress have={3} total={4} />
                <strong className="preview-recipe-title">Sinigang na Baboy</strong>
                <div className="recipe-metrics">
                  <span className="metric-price">₱220–₱300</span>
                  <span>50 min</span>
                  <span>Medium</span>
                </div>
                <div className="ingredient-summary">
                  <div><strong>You have</strong>{['pork', 'tomato', 'water spinach'].map((item) => <IngredientChip key={item} name={label(item)} variant="have" />)}</div>
                  <div><strong>To buy</strong><IngredientChip name={label('tamarind')} variant="missing" /></div>
                </div>
              </div>
            </div>
          </PreviewFrame>
        </div>

        <div className="how-row">
          <StepCopy n={3} title="Cook one step at a time">
            <p>Cooking mode shows one big step at a time, with the ingredients it needs and a timer that keeps running.</p>
            <p>Steps can be read aloud, and your screen stays on while you cook.</p>
          </StepCopy>
          <PreviewFrame label="Cooking mode">
            <div className="preview-cooking">
              <div className="preview-cooking-top">
                <strong>Adobong Manok</strong>
                <span>2 / 5</span>
              </div>
              <div className="progress-track"><span style={{ width: '40%' }} /></div>
              <p className="preview-cooking-step">Add the chicken, soy sauce, and vinegar. Simmer without stirring until the vinegar mellows.</p>
              <div className="preview-chip-row preview-chip-row-center">
                {['chicken', 'soy sauce', 'vinegar'].map((item) => <IngredientChip key={item} name={label(item)} variant="staple" />)}
              </div>
              <div className="preview-timer">
                <Icon icon="lucide:timer" width={18} height={18} />
                <span>12:40</span>
              </div>
            </div>
          </PreviewFrame>
        </div>
      </section>

      <section className="home-section" aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="sr-only">Why Hapag</h2>
        <ul className="home-principles">
          {PRINCIPLES.map((principle) => (
            <li key={principle.title}>
              <Icon icon={principle.icon} width={20} height={20} aria-hidden="true" />
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section home-closing" aria-labelledby="closing-heading">
        <h2 id="closing-heading">What's for <em>ulam</em> tonight?</h2>
        <p>Start with what's in your kusina. A few ingredients are enough.</p>
        <div className="home-actions">
          <button className="button button-primary home-start-button" type="button" onClick={() => onStart('')}>
            Start with Ulam AI
          </button>
          <button className="button button-secondary home-surprise-button" type="button" onClick={onSurprise}>
            <Icon icon="lucide:dices" width={18} height={18} aria-hidden="true" /> Surprise me!
          </button>
        </div>
        <p className="trust-note">Prices are estimates. Check labels before cooking.</p>
      </section>
    </div>
  )
}
