import { getDishPhoto } from '../lib/dishPhotoLookup.ts'

interface DishImageProps {
  recipe: { id?: string; title: string; localTitle?: string }
  variant: 'card' | 'hero'
}

export function DishImage({ recipe, variant }: DishImageProps) {
  const photo = getDishPhoto(recipe)
  const className = variant === 'card' ? 'recipe-card-image' : 'recipe-hero-image'

  // No placeholder tile: a card without a verified photo simply starts with its text.
  if (!photo) return null

  return (
    <figure className={`${className} dish-image`}>
      <img className="dish-image-img" src={photo.src} alt={recipe.title} width={640} height={360} decoding="async" loading={variant === 'card' ? 'lazy' : 'eager'} />
      <figcaption className="dish-image-credit">
        Photo: <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.author}</a>
        {' · '}
        {photo.licenseUrl ? <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> : photo.license}
      </figcaption>
    </figure>
  )
}
