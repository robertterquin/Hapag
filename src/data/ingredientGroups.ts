export type IngredientGroup =
  | 'leafy-greens'
  | 'seafood'
  | 'meat'
  | 'cooking-fats'
  | 'souring-agents'
  | 'aromatics'
  | 'noodles'
  | 'rice-and-grains'

export interface IngredientSubstitutionRule {
  ingredient: string
  substitute: string
  group: IngredientGroup
  note: string
}

export const ingredientGroups: Record<IngredientGroup, readonly string[]> = {
  'leafy-greens': ['bok choy', 'water spinach', 'chili leaves', 'malunggay', 'cabbage'],
  seafood: ['shrimp', 'fish', 'milkfish', 'squid', 'mussels', 'tilapia', 'crab'],
  meat: ['chicken', 'pork', 'pork belly', 'beef', 'goat', 'ground pork', 'ground beef'],
  'cooking-fats': ['oil', 'butter'],
  'souring-agents': ['tamarind', 'calamansi', 'lemon', 'vinegar', 'coconut vinegar'],
  aromatics: ['garlic', 'onion', 'ginger', 'lemongrass', 'green onion'],
  noodles: ['flour noodles', 'rice noodles', 'egg noodles', 'thick rice noodles', 'glass noodles', 'misua noodles', 'pancit bato noodles'],
  'rice-and-grains': ['cooked rice', 'uncooked rice', 'rice flour', 'glutinous rice'],
}

export const ingredientSubstitutionRules: readonly IngredientSubstitutionRule[] = [
  { ingredient: 'tamarind', substitute: 'calamansi', group: 'souring-agents', note: 'Calamansi supplies a bright sour flavor.' },
  { ingredient: 'tamarind', substitute: 'lemon', group: 'souring-agents', note: 'Lemon can provide comparable acidity.' },
  { ingredient: 'cabbage', substitute: 'bok choy', group: 'leafy-greens', note: 'Bok choy cooks quickly as a leafy vegetable substitute.' },
  { ingredient: 'bok choy', substitute: 'cabbage', group: 'leafy-greens', note: 'Cabbage provides a similar vegetable base.' },
  { ingredient: 'water spinach', substitute: 'bok choy', group: 'leafy-greens', note: 'Bok choy is a practical leafy-green substitute.' },
  { ingredient: 'water spinach', substitute: 'cabbage', group: 'leafy-greens', note: 'Cabbage can replace leafy greens in a home-style version.' },
  { ingredient: 'rice noodles', substitute: 'flour noodles', group: 'noodles', note: 'Flour noodles create a chewier noodle variation.' },
  { ingredient: 'flour noodles', substitute: 'rice noodles', group: 'noodles', note: 'Rice noodles create a lighter noodle variation.' },
  { ingredient: 'cooked rice', substitute: 'uncooked rice', group: 'rice-and-grains', note: 'Uncooked rice must be cooked before serving.' },
  { ingredient: 'tomato sauce', substitute: 'tomato', group: 'souring-agents', note: 'Fresh tomatoes can be sautéed to build a flavorful tomato base.' },
  { ingredient: 'tomato', substitute: 'tomato sauce', group: 'souring-agents', note: 'Tomato sauce can replace fresh tomatoes for rich stewing.' },
  { ingredient: 'fish', substitute: 'tilapia', group: 'seafood', note: 'Tilapia is a practical and widely available fish choice.' },
  { ingredient: 'fish', substitute: 'milkfish', group: 'seafood', note: 'Bangus (milkfish) is a traditional Filipino fish choice.' },
  { ingredient: 'milkfish', substitute: 'tilapia', group: 'seafood', note: 'Tilapia is an accessible alternative to milkfish.' },
  { ingredient: 'tilapia', substitute: 'milkfish', group: 'seafood', note: 'Milkfish is a flavorful alternative to tilapia.' },
]

const groupByIngredient = new Map<string, IngredientGroup>()
for (const [group, ingredients] of Object.entries(ingredientGroups) as [IngredientGroup, readonly string[]][]) {
  for (const ingredient of ingredients) groupByIngredient.set(ingredient, group)
}

export function getIngredientGroup(ingredient: string) {
  return groupByIngredient.get(ingredient)
}
