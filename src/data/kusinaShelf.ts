export interface KusinaItem {
  name: string
  localName: string
  canonicalName: string
  emoji: string
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

  { name: 'Chicken', localName: 'Manok', canonicalName: 'chicken', emoji: '🍗', category: 'protina' },
  { name: 'Pork', localName: 'Baboy', canonicalName: 'pork', emoji: '🥓', category: 'protina' },
  { name: 'Egg', localName: 'Itlog', canonicalName: 'egg', emoji: '🥚', category: 'protina' },
  { name: 'Sardines', localName: 'Sardinas', canonicalName: 'canned sardines', emoji: '🥫', category: 'protina' },
  { name: 'Tofu', localName: 'Tokwa', canonicalName: 'tofu', emoji: '🫘', category: 'protina' },
  { name: 'Bangus', localName: 'Bangus', canonicalName: 'milkfish', emoji: '🐟', category: 'protina' },
  { name: 'Tilapia', localName: 'Tilapia', canonicalName: 'tilapia', emoji: '🐟', category: 'protina' },
  { name: 'Shrimp', localName: 'Hipon', canonicalName: 'shrimp', emoji: '🦐', category: 'protina' },
  { name: 'Corned Beef', localName: 'Corned Beef', canonicalName: 'corned beef', emoji: '🥫', category: 'protina' },

  { name: 'Pechay', localName: 'Pechay', canonicalName: 'pechay', emoji: '🥬', category: 'gulay' },
  { name: 'Kangkong', localName: 'Kangkong', canonicalName: 'kangkong', emoji: '🌿', category: 'gulay' },
  { name: 'Eggplant', localName: 'Talong', canonicalName: 'eggplant', emoji: '🍆', category: 'gulay' },
  { name: 'Sayote', localName: 'Sayote', canonicalName: 'sayote', emoji: '🍐', category: 'gulay' },
  { name: 'Potato', localName: 'Patatas', canonicalName: 'potato', emoji: '🥔', category: 'gulay' },
  { name: 'Tomato', localName: 'Kamatis', canonicalName: 'tomato', emoji: '🍅', category: 'gulay' },
  { name: 'Cabbage', localName: 'Repolyo', canonicalName: 'cabbage', emoji: '🥬', category: 'gulay' },
  { name: 'String Beans', localName: 'Sitaw', canonicalName: 'string beans', emoji: '🫛', category: 'gulay' },
  { name: 'Squash', localName: 'Kalabasa', canonicalName: 'squash', emoji: '🎃', category: 'gulay' },

  { name: 'Garlic', localName: 'Bawang', canonicalName: 'garlic', emoji: '🧄', category: 'pampalasa' },
  { name: 'Onion', localName: 'Sibuyas', canonicalName: 'onion', emoji: '🧅', category: 'pampalasa' },
  { name: 'Ginger', localName: 'Luya', canonicalName: 'luya', emoji: '🫚', category: 'pampalasa' },
  { name: 'Chili', localName: 'Sili', canonicalName: 'chili', emoji: '🌶️', category: 'pampalasa' },
  { name: 'Soy Sauce', localName: 'Toyo', canonicalName: 'soy sauce', emoji: '🍶', category: 'pampalasa' },
  { name: 'Vinegar', localName: 'Suka', canonicalName: 'vinegar', emoji: '🧴', category: 'pampalasa' },
  { name: 'Fish Sauce', localName: 'Patis', canonicalName: 'fish sauce', emoji: '🐠', category: 'pampalasa' },
  { name: 'Black Pepper', localName: 'Paminta', canonicalName: 'black pepper', emoji: '🧂', category: 'pampalasa' },
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
