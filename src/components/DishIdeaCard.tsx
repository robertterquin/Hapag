import { useDisplayLanguage } from '../app/displayLanguage.ts'
import type { DishIdea } from '../lib/catalogIdeas.ts'
import { labelForName } from '../lib/ingredientLabels.ts'
import { DishImage } from './DishImage.tsx'
import { HaveProgress } from './HaveProgress.tsx'
import { IngredientChip } from './IngredientChip.tsx'

interface DishIdeaCardProps {
  idea: DishIdea
}

export function DishIdeaCard({ idea }: DishIdeaCardProps) {
  const language = useDisplayLanguage()
  const label = (name: string) => labelForName(name, language)
  const haveCount = idea.have.length + idea.substitutions.length

  return (
    <article className="recipe-card dish-idea-card">
      <DishImage recipe={{ id: idea.id, title: idea.name, localTitle: idea.localName }} variant="card" />
      <div className="recipe-card-topline">
        <span className="recipe-badge">Catalog match</span>
        <span className="recipe-authenticity-badge">{idea.cookingMethod}</span>
      </div>
      <div className="recipe-card-main dish-idea-body">
        <HaveProgress have={haveCount} total={haveCount + idea.missing.length} />
        <h2>{idea.name}</h2>
        {idea.localName && idea.localName !== idea.name ? <p className="dish-idea-local">{idea.localName}</p> : null}
        <p className="recipe-description">{idea.description}</p>
        <div className="ingredient-summary" aria-label="Ingredient evidence">
          <div><strong>You have ({haveCount})</strong>{idea.have.map((item) => <IngredientChip key={item} name={label(item)} variant="have" />)}{idea.substitutions.map((item) => <IngredientChip key={item.requiredIngredient} name={`${label(item.providedIngredient)} for ${label(item.requiredIngredient)}`} variant="substitute" />)}</div>
          {idea.missing.length > 0 ? <div><strong>To buy ({idea.missing.length})</strong>{idea.missing.map((item) => <IngredientChip key={item} name={label(item)} variant="missing" />)}</div> : null}
          {idea.staples.length > 0 ? <div><strong>Probably in your kusina</strong>{idea.staples.map((item) => <IngredientChip key={item} name={label(item)} variant="staple" />)}</div> : null}
        </div>
      </div>
    </article>
  )
}
