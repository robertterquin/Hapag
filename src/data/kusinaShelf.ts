import type { IconifyIcon } from '@iconify/react'
import { pantryIcons } from './pantryIcons.ts'
export interface KusinaItem {
  name: string
  localName: string
  canonicalName: string
  // An Iconify name (Fluent Emoji Flat) or one of our own drawings, so every phone shows the same picture.
  icon: string | IconifyIcon
  category: 'protina' | 'gulay' | 'pampalasa'
}

export interface KusinaCategory {
  id: 'all' | 'protina' | 'gulay' | 'pampalasa'
  label: string
  sublabel: string
}

export const kusinaCategories: readonly KusinaCategory[] = [
  { id: 'all', label: 'All', sublabel: 'Essential ingredients' },
  { id: 'protina', label: 'Proteins & Meat', sublabel: 'Chicken, Pork, Fish, Eggs' },
  { id: 'gulay', label: 'Fresh Vegetables', sublabel: 'Bok Choy, Kangkong, Eggplant' },
  { id: 'pampalasa', label: 'Spices & Seasonings', sublabel: 'Garlic, Onion, Soy Sauce, Vinegar' },
] as const

export const kusinaPantryItems: readonly KusinaItem[] = [

  { name: 'Chicken', localName: 'Manok', canonicalName: 'chicken', icon: 'fluent-emoji-flat:poultry-leg', category: 'protina' },
  { name: 'Pork', localName: 'Baboy', canonicalName: 'pork', icon: 'fluent-emoji-flat:bacon', category: 'protina' },
  { name: 'Egg', localName: 'Itlog', canonicalName: 'egg', icon: 'fluent-emoji-flat:egg', category: 'protina' },
  { name: 'Sardines', localName: 'Sardinas', canonicalName: 'canned sardines', icon: 'fluent-emoji-flat:canned-food', category: 'protina' },
  { name: 'Tofu', localName: 'Tokwa', canonicalName: 'tofu', icon: pantryIcons.tofu, category: 'protina' },
  { name: 'Bangus', localName: 'Bangus', canonicalName: 'milkfish', icon: 'fluent-emoji-flat:fish', category: 'protina' },
  { name: 'Tilapia', localName: 'Tilapia', canonicalName: 'tilapia', icon: 'fluent-emoji-flat:fish', category: 'protina' },
  { name: 'Shrimp', localName: 'Hipon', canonicalName: 'shrimp', icon: 'fluent-emoji-flat:shrimp', category: 'protina' },
  { name: 'Corned Beef', localName: 'Corned Beef', canonicalName: 'corned beef', icon: pantryIcons.cornedBeef, category: 'protina' },

  { name: 'Pechay', localName: 'Pechay', canonicalName: 'pechay', icon: 'fluent-emoji-flat:leafy-green', category: 'gulay' },
  { name: 'Kangkong', localName: 'Kangkong', canonicalName: 'kangkong', icon: 'fluent-emoji-flat:herb', category: 'gulay' },
  { name: 'Eggplant', localName: 'Talong', canonicalName: 'eggplant', icon: 'fluent-emoji-flat:eggplant', category: 'gulay' },
  { name: 'Sayote', localName: 'Sayote', canonicalName: 'sayote', icon: pantryIcons.chayote, category: 'gulay' },
  { name: 'Potato', localName: 'Patatas', canonicalName: 'potato', icon: 'fluent-emoji-flat:potato', category: 'gulay' },
  { name: 'Tomato', localName: 'Kamatis', canonicalName: 'tomato', icon: 'fluent-emoji-flat:tomato', category: 'gulay' },
  { name: 'Cabbage', localName: 'Repolyo', canonicalName: 'cabbage', icon: pantryIcons.cabbage, category: 'gulay' },
  { name: 'String Beans', localName: 'Sitaw', canonicalName: 'string beans', icon: pantryIcons.longBeans, category: 'gulay' },
  { name: 'Squash', localName: 'Kalabasa', canonicalName: 'squash', icon: pantryIcons.squash, category: 'gulay' },

  { name: 'Garlic', localName: 'Bawang', canonicalName: 'garlic', icon: 'fluent-emoji-flat:garlic', category: 'pampalasa' },
  { name: 'Onion', localName: 'Sibuyas', canonicalName: 'onion', icon: 'fluent-emoji-flat:onion', category: 'pampalasa' },
  { name: 'Ginger', localName: 'Luya', canonicalName: 'luya', icon: 'fluent-emoji-flat:ginger-root', category: 'pampalasa' },
  { name: 'Chili', localName: 'Sili', canonicalName: 'chili', icon: 'fluent-emoji-flat:hot-pepper', category: 'pampalasa' },
  { name: 'Soy Sauce', localName: 'Toyo', canonicalName: 'soy sauce', icon: pantryIcons.soySauce, category: 'pampalasa' },
  { name: 'Vinegar', localName: 'Suka', canonicalName: 'vinegar', icon: pantryIcons.vinegar, category: 'pampalasa' },
  { name: 'Fish Sauce', localName: 'Patis', canonicalName: 'fish sauce', icon: pantryIcons.fishSauce, category: 'pampalasa' },
  { name: 'Black Pepper', localName: 'Paminta', canonicalName: 'black pepper', icon: pantryIcons.blackPepper, category: 'pampalasa' },
]

export interface SmartPairing {
  triggerName: string
  suggestions: { name: string; localName: string }[]
}

const pairingRules: Record<string, { name: string; localName: string }[]> = {
  chicken: [
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Soy Sauce', localName: 'Toyo' },
    { name: 'Vinegar', localName: 'Suka' },
    { name: 'Potato', localName: 'Patatas' },
  ],
  pork: [
    { name: 'Onion', localName: 'Sibuyas' },
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Soy Sauce', localName: 'Toyo' },
    { name: 'Kangkong', localName: 'Kangkong' },
  ],
  'canned sardines': [
    { name: 'Egg', localName: 'Itlog' },
    { name: 'Pechay', localName: 'Pechay' },
    { name: 'Tomato', localName: 'Kamatis' },
    { name: 'Garlic', localName: 'Bawang' },
  ],
  egg: [
    { name: 'Tomato', localName: 'Kamatis' },
    { name: 'Onion', localName: 'Sibuyas' },
    { name: 'Eggplant', localName: 'Talong' },
    { name: 'Sardines', localName: 'Sardinas' },
  ],

  milkfish: [
    { name: 'Ginger', localName: 'Luya' },
    { name: 'Tomato', localName: 'Kamatis' },
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Vinegar', localName: 'Suka' },
  ],

  tilapia: [
    { name: 'Ginger', localName: 'Luya' },
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Tomato', localName: 'Kamatis' },
    { name: 'Sayote', localName: 'Sayote' },
  ],
  pechay: [
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Egg', localName: 'Itlog' },
    { name: 'Sardines', localName: 'Sardinas' },
  ],
  shrimp: [
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Ginger', localName: 'Luya' },
    { name: 'Sayote', localName: 'Sayote' },
    { name: 'Kangkong', localName: 'Kangkong' },
  ],
  'corned beef': [
    { name: 'Potato', localName: 'Patatas' },
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Onion', localName: 'Sibuyas' },
    { name: 'Tomato', localName: 'Kamatis' },
  ],
  tofu: [
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Soy Sauce', localName: 'Toyo' },
    { name: 'Vinegar', localName: 'Suka' },
    { name: 'Pechay', localName: 'Pechay' },
  ],
}

export function getSmartPairings(activeCanonicalNames: string[]): { name: string; localName: string }[] {
  const suggestedMap = new Map<string, { name: string; localName: string }>()
  for (const canon of activeCanonicalNames) {
    const pairs = pairingRules[canon]
    if (pairs) {
      for (const pair of pairs) {
        if (!activeCanonicalNames.includes(pair.localName.toLowerCase()) && !activeCanonicalNames.includes(pair.name.toLowerCase())) {
          suggestedMap.set(pair.localName, pair)
        }
      }
    }
  }
  return Array.from(suggestedMap.values()).slice(0, 5)
}
