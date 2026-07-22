import { useState } from 'react'
import type { NormalizedIngredient } from '../types/domain.ts'

interface PantryItemEditorProps {
  item: NormalizedIngredient
  onUpdate: (input: { id: string; name: string }) => Promise<void>
  onRemove: (id: string) => Promise<void>
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function PantryItemEditor({ item, onUpdate, onRemove }: PantryItemEditorProps) {
  const [name, setName] = useState(item.name)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const commit = async () => {
    if (!name.trim()) {
      setSaveState('error')
      return
    }
    setSaveState('saving')
    try {
      await onUpdate({ id: item.id, name: name.trim() })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const statusLabel = saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Could not save' : ''

  return (
    <li className="pantry-item-row">
      <div className="pantry-item-fields pantry-item-fields-name-only">
        <label className="sr-only" htmlFor={`pantry-name-${item.id}`}>Ingredient name</label>
        <input id={`pantry-name-${item.id}`} value={name} onChange={(event) => { setName(event.target.value); setSaveState('idle') }} onBlur={() => void commit()} />
      </div>
      <div className="pantry-item-meta">
        {item.confidence === 'low' ? <span className="pantry-review-note">Check this item</span> : null}
        {statusLabel ? <span className={`pantry-item-status pantry-item-status-${saveState}`} role={saveState === 'error' ? 'alert' : 'status'}>{statusLabel}</span> : null}
      </div>
      <div className="pantry-item-actions">
        <button className="text-button pantry-remove-button" type="button" onClick={() => void onRemove(item.id)}>Remove</button>
      </div>
    </li>
  )
}
