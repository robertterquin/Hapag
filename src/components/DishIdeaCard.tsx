import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useDisplayLanguage } from '../app/displayLanguage.ts'
import type { DishIdea } from '../lib/catalogIdeas.ts'
import { labelForName } from '../lib/ingredientLabels.ts'
import { DishImage } from './DishImage.tsx'
import { HaveProgress } from './HaveProgress.tsx'
import { IngredientChip } from './IngredientChip.tsx'

interface DishIdeaCardProps {
  idea: DishIdea
  // Fetches the full recipe for this dish; absent when the AI isn't set up, so the card stays an idea.
  onGetRecipe?: () => Promise<void>
}

export function DishIdeaCard({ idea, onGetRecipe }: DishIdeaCardProps) {
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'failed'>('idle')
  const getRecipe = async () => {
    if (!onGetRecipe) return
    setFetchState('loading')
    try {
      await onGetRecipe()
    } catch {
      setFetchState('failed')
    }
  }
  const language = useDisplayLanguage()
  const label = (name: string) => labelForName(name, language)
  const haveCount = idea.have.length + idea.substitutions.length

  return (
    <article className="recipe-card dish-idea-card">
      <DishImage recipe={{ id: idea.id, title: idea.name, localTitle: idea.localName }} variant="card" />
      <div className="recipe-card-main dish-idea-body">
        <HaveProgress have={haveCount} total={haveCount + idea.missing.length} />
        <h2>{idea.name}</h2>
        {idea.localName && idea.localName !== idea.name ? <p className="dish-idea-local">{idea.localName}</p> : null}
        {/* Catalog dishes carry no price or time, so the row shows what the catalog does know. */}
        <div className="recipe-metrics" aria-label="Dish summary">
          <span>{idea.mealType}</span>
          <span>{idea.cookingMethod.replace(/^./, (letter) => letter.toUpperCase())}</span>
        </div>
        <p className="recipe-description">{idea.description}</p>
        {idea.substitutions.length + idea.missing.length + idea.staples.length > 0 ? (
          <div className="ingredient-summary" aria-label="Ingredient evidence">
            {idea.substitutions.length > 0 ? <div><strong>Swaps</strong>{idea.substitutions.map((item) => <IngredientChip key={item.requiredIngredient} name={`${label(item.providedIngredient)} for ${label(item.requiredIngredient)}`} variant="substitute" />)}</div> : null}
            {idea.missing.length > 0 ? <div><strong>To buy</strong>{idea.missing.map((item) => <IngredientChip key={item} name={label(item)} variant="missing" />)}</div> : null}
            {idea.staples.length > 0 ? <div><strong>Staples</strong>{idea.staples.map((item) => <IngredientChip key={item} name={label(item)} variant="staple" />)}</div> : null}
          </div>
        ) : null}
        {onGetRecipe ? (
          <div className="dish-idea-actions">
            <button className="button button-secondary full-width" type="button" onClick={() => void getRecipe()} disabled={fetchState === 'loading'} aria-busy={fetchState === 'loading'}>
              {fetchState === 'loading' ? 'Getting the recipe…' : <>Get the recipe <Icon icon="lucide:arrow-right" width={16} height={16} aria-hidden="true" /></>}
            </button>
            {fetchState === 'failed' ? (
              <p className="dish-idea-error" role="alert">
                Couldn't get this recipe right now.{' '}
                <a href={`https://www.google.com/search?q=${encodeURIComponent(`${idea.name} recipe`)}`} target="_blank" rel="noreferrer">Search online</a>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
