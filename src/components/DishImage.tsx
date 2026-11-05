import { useState } from 'react'
import { Icon } from '@iconify/react'
import { getDishIcon, getDishPhoto } from '../lib/dishPhotoLookup.ts'

interface DishImageProps {
  recipe: { id?: string; title: string; localTitle?: string }
  variant: 'card' | 'hero'
}

export function DishImage({ recipe, variant }: DishImageProps) {
  const photo = getDishPhoto(recipe)
  const [creditOpen, setCreditOpen] = useState(false)
  const className = variant === 'card' ? 'recipe-card-image' : 'recipe-hero-image'

  // Dishes without a verified photo get a same-size tile, a plate on a checked tablecloth, so cards in a grid line up.
  if (!photo) {
    return (
      <div className={`${className} dish-image dish-image-placeholder`} aria-hidden="true">
        <span className="dish-image-plate">{getDishIcon(recipe)}</span>
      </div>
    )
  }

  return (
    <figure className={`${className} dish-image`}>
      <img className="dish-image-img" src={photo.src} alt={recipe.title} width={640} height={360} style={photo.position ? { objectPosition: photo.position } : undefined} decoding="async" loading={variant === 'card' ? 'lazy' : 'eager'} />
      {/* The licence credit sits behind an info button so it stays available without covering the dish. */}
      <figcaption className={`dish-image-credit ${creditOpen ? 'dish-image-credit-open' : ''}`}>
        {creditOpen ? (
          <span>
            Photo: <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.author}</a>
            {' · '}
            {photo.licenseUrl ? <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> : photo.license}
          </span>
        ) : null}
        <button type="button" aria-label={creditOpen ? 'Hide photo credit' : 'Show photo credit'} aria-expanded={creditOpen} onClick={() => setCreditOpen(!creditOpen)}>
          <Icon icon={creditOpen ? 'lucide:x' : 'lucide:info'} width={14} height={14} aria-hidden="true" />
        </button>
      </figcaption>
    </figure>
  )
}
