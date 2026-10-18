import { useCallback, useState } from 'react'
import { Icon } from '@iconify/react'
import type { Recipe } from '../types/domain.ts'
import { buildShoppingList, formatShoppingList } from '../lib/shoppingList.ts'

type CopyState = 'idle' | 'copied' | 'failed'

export function ShoppingListPanel({ recipe }: { recipe: Recipe }) {
  const [includeStaples, setIncludeStaples] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const list = buildShoppingList(recipe, { includeStaples })
  const text = formatShoppingList(recipe, list)
  // Stable so the box is focused and selected once when it appears, not on every render.
  const selectFallback = useCallback((element: HTMLTextAreaElement | null) => { element?.focus(); element?.select() }, [])
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  const share = async () => {
    try {
      await navigator.share({ title: `Shopping list: ${recipe.title}`, text })
    } catch {
      // Dismissing the share sheet rejects too; nothing to report.
    }
  }

  return (
    <section className="detail-section shopping-list" aria-labelledby="shopping-heading">
      <div className="section-heading-row">
        <div>
          <span className="section-kicker">Palengke run</span>
          <h2 id="shopping-heading">Shopping list</h2>
        </div>
        {list.knownTotal !== undefined ? <strong className="cost-total">about ₱{list.knownTotal}</strong> : null}
      </div>

      {list.items.length === 0 ? (
        <p className="muted-copy">Nothing to buy. You have everything{includeStaples ? '' : ', assuming your kusina staples'}.</p>
      ) : (
        <ul className="shopping-items">
          {list.items.map((item) => (
            <li key={item.name} className={item.staple ? 'shopping-item-staple' : undefined}>
              <span><strong>{item.quantity}</strong> {item.name}{item.staple ? <small> · staple</small> : null}</span>
              <span className="shopping-price">{item.estimatedCost !== undefined ? `₱${item.estimatedCost}` : '—'}</span>
            </li>
          ))}
        </ul>
      )}

      <label className="shopping-toggle">
        <input type="checkbox" checked={includeStaples} onChange={(event) => { setIncludeStaples(event.target.checked); setCopyState('idle') }} />
        Include kusina staples
      </label>

      {list.items.length > 0 ? (
        <div className="shopping-actions">
          <button className="button button-secondary" type="button" onClick={() => void copy()}>
            <Icon icon={copyState === 'copied' ? 'lucide:check' : 'lucide:copy'} width={16} height={16} aria-hidden="true" />
            {copyState === 'copied' ? 'Copied' : 'Copy list'}
          </button>
          {canShare ? (
            <button className="button button-secondary" type="button" onClick={() => void share()}>
              <Icon icon="lucide:share-2" width={16} height={16} aria-hidden="true" /> Share
            </button>
          ) : null}
        </div>
      ) : null}
      {copyState === 'failed' ? (
        <div className="shopping-fallback">
          <p className="inline-warning" role="alert">Your browser blocked copying. The list is selected below; copy it from there.</p>
          <textarea
            className="shopping-fallback-text"
            readOnly
            rows={list.items.length + 2}
            value={text}
            aria-label="Shopping list text"
            ref={selectFallback}
          />
        </div>
      ) : null}
      <span className="sr-only" role="status" aria-live="polite">{copyState === 'copied' ? 'Shopping list copied.' : ''}</span>
    </section>
  )
}
