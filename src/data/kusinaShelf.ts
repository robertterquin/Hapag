export interface KusinaItem {
  name: string
  localName: string
  canonicalName: string
  category: 'protina' | 'gulay' | 'pampalasa'
}

export interface KusinaCategory {
  id: 'all' | 'protina' | 'gulay' | 'pampalasa'
  label: string
  sublabel: string
}

export const kusinaCategories: readonly KusinaCategory[] = [
  { id: 'all', label: 'Lahat', sublabel: 'Pangunahing sangkap' },
  { id: 'protina', label: 'Protina at Karne', sublabel: 'Manok, Baboy, Isda, Itlog' },
  { id: 'gulay', label: 'Sariwang Gulay', sublabel: 'Pechay, Kangkong, Talong' },
  { id: 'pampalasa', label: 'Pampalasa at Sahog', sublabel: 'Bawang, Sibuyas, Toyo, Suka' },
] as const

export const kusinaPantryItems: readonly KusinaItem[] = [
  // Protina
  { name: 'Chicken', localName: 'Manok', canonicalName: 'chicken', category: 'protina' },
  { name: 'Pork', localName: 'Baboy', canonicalName: 'pork', category: 'protina' },
  { name: 'Egg', localName: 'Itlog', canonicalName: 'egg', category: 'protina' },
  { name: 'Sardines', localName: 'Sardinas', canonicalName: 'canned sardines', category: 'protina' },
  { name: 'Tofu', localName: 'Tokwa', canonicalName: 'tofu', category: 'protina' },
  { name: 'Fish', localName: 'Isda', canonicalName: 'fish', category: 'protina' },
  { name: 'Shrimp', localName: 'Hipon', canonicalName: 'shrimp', category: 'protina' },
  { name: 'Corned Beef', localName: 'Corned Beef', canonicalName: 'corned beef', category: 'protina' },

  // Gulay
  { name: 'Pechay', localName: 'Pechay', canonicalName: 'pechay', category: 'gulay' },
  { name: 'Kangkong', localName: 'Kangkong', canonicalName: 'kangkong', category: 'gulay' },
  { name: 'Eggplant', localName: 'Talong', canonicalName: 'eggplant', category: 'gulay' },
  { name: 'Sayote', localName: 'Sayote', canonicalName: 'sayote', category: 'gulay' },
  { name: 'Potato', localName: 'Patatas', canonicalName: 'potato', category: 'gulay' },
  { name: 'Tomato', localName: 'Kamatis', canonicalName: 'tomato', category: 'gulay' },
  { name: 'Cabbage', localName: 'Repolyo', canonicalName: 'cabbage', category: 'gulay' },
  { name: 'String Beans', localName: 'Sitaw', canonicalName: 'string beans', category: 'gulay' },
  { name: 'Squash', localName: 'Kalabasa', canonicalName: 'squash', category: 'gulay' },

  // Pampalasa
  { name: 'Garlic', localName: 'Bawang', canonicalName: 'garlic', category: 'pampalasa' },
  { name: 'Onion', localName: 'Sibuyas', canonicalName: 'onion', category: 'pampalasa' },
  { name: 'Ginger', localName: 'Luya', canonicalName: 'luya', category: 'pampalasa' },
  { name: 'Chili', localName: 'Sili', canonicalName: 'chili', category: 'pampalasa' },
  { name: 'Soy Sauce', localName: 'Toyo', canonicalName: 'soy sauce', category: 'pampalasa' },
  { name: 'Vinegar', localName: 'Suka', canonicalName: 'vinegar', category: 'pampalasa' },
  { name: 'Fish Sauce', localName: 'Patis', canonicalName: 'fish sauce', category: 'pampalasa' },
  { name: 'Black Pepper', localName: 'Paminta', canonicalName: 'black pepper', category: 'pampalasa' },
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
  fish: [
    { name: 'Tomato', localName: 'Kamatis' },
    { name: 'Ginger', localName: 'Luya' },
    { name: 'Kangkong', localName: 'Kangkong' },
    { name: 'Sayote', localName: 'Sayote' },
  ],
  pechay: [
    { name: 'Garlic', localName: 'Bawang' },
    { name: 'Egg', localName: 'Itlog' },
    { name: 'Sardines', localName: 'Sardinas' },
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
