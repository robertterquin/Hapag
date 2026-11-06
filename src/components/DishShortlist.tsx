import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { DishIdea } from '../lib/catalogIdeas.ts'
import { getDishPhoto } from '../lib/dishPhotoLookup.ts'

const TILTS = [-5, 1, 6]

// The catalog's best matches, found before the AI call starts: honest "what Hapag is weighing up".
// Cards deal in, then take turns lifting; still for reduced motion.
export function DishShortlist({ ideas }: { ideas: DishIdea[] }) {
  const reduceMotion = useReducedMotion()
  const shown = ideas.slice(0, 3)
  const [focus, setFocus] = useState(0)

  useEffect(() => {
    if (reduceMotion || shown.length < 2) return undefined
    const timer = window.setInterval(() => setFocus((current) => (current + 1) % shown.length), 1400)
    return () => window.clearInterval(timer)
  }, [reduceMotion, shown.length])

  if (shown.length === 0) return null

  return (
    <div className="dish-shortlist">
      <p className="dish-shortlist-label">Considering</p>
      <ul className="dish-shortlist-cards">
        {shown.map((idea, i) => {
          const have = idea.have.length + idea.substitutions.length
          const total = have + idea.missing.length
          const photo = getDishPhoto({ id: idea.id, title: idea.name, localTitle: idea.localName })
          const lifted = !reduceMotion && i === focus
          return (
            <motion.li
              key={idea.id}
              className={`dish-shortlist-card ${lifted ? 'is-lifted' : ''}`}
              initial={{ opacity: 0, y: 24, rotate: TILTS[i] * 2 }}
              animate={{ opacity: 1, y: lifted ? -10 : 0, rotate: lifted ? 0 : TILTS[i] }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: reduceMotion ? 0 : i * 0.12 }}
            >
              <div className="dish-shortlist-photo">
                {photo
                  ? <img src={photo.src.replace('/960px-', '/330px-')} alt="" loading="lazy" decoding="async" style={photo.position ? { objectPosition: photo.position } : undefined} />
                  : <span className="dish-shortlist-plate" aria-hidden="true" />}
              </div>
              <strong>{idea.name}</strong>
              <span className={`dish-shortlist-have ${have === total ? 'is-complete' : ''}`}><span className="dish-shortlist-have-prefix">You have </span>{have === total ? `all ${total}` : `${have} of ${total}`}</span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
