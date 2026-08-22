export interface DishMatchingRule {
  /** Each group must have at least one available ingredient or approved substitute. */
  requiredAny?: string[][]
  /** Ingredients that make this candidate incompatible with the supplied dish identity. */
  excludedIfPresent?: string[]
  /** Supporting ingredients used only to break close ranking ties. */
  preferredIngredients?: string[]
}

export const dishMatchingRules: Record<string, DishMatchingRule> = {
  'chicken-adobo': {
    requiredAny: [['soy sauce', 'vinegar'], ['chicken', 'pork']],
    preferredIngredients: ['garlic', 'onion'],
  },
  'pork-adobo': {
    requiredAny: [['soy sauce', 'vinegar'], ['pork', 'chicken']],
    preferredIngredients: ['garlic', 'onion'],
  },
  'adobong-kangkong': {
    requiredAny: [['soy sauce', 'vinegar'], ['water spinach']],
    preferredIngredients: ['garlic'],
  },
  'adobong-pusit': {
    requiredAny: [['soy sauce', 'vinegar'], ['squid', 'shrimp']],
    preferredIngredients: ['garlic'],
  },
  'adobong-tahong': {
    requiredAny: [['soy sauce', 'vinegar'], ['mussels', 'squid']],
    preferredIngredients: ['garlic'],
  },
  'adobong-manok-sa-gata': {
    requiredAny: [['soy sauce', 'vinegar'], ['chicken', 'pork']],
    preferredIngredients: ['coconut milk', 'garlic'],
  },
  'adobong-sitaw': {
    requiredAny: [['soy sauce', 'vinegar'], ['long beans', 'water spinach']],
    preferredIngredients: ['garlic'],
  },
  'adobong-talong': {
    requiredAny: [['soy sauce', 'vinegar'], ['eggplant', 'bitter melon']],
    preferredIngredients: ['garlic'],
  },
  'sinigang-na-baboy': {
    requiredAny: [['tamarind', 'calamansi', 'lemon']],
    preferredIngredients: ['tomato', 'onion'],
  },
  'sinigang-na-hipon': {
    requiredAny: [['tamarind', 'calamansi', 'lemon']],
    preferredIngredients: ['tomato', 'onion'],
  },
  'sinigang-na-isda': {
    requiredAny: [['tamarind', 'calamansi', 'lemon']],
    preferredIngredients: ['tomato', 'onion'],
  },
  'sinigang-na-manok': {
    requiredAny: [['chicken', 'pork'], ['tamarind', 'calamansi', 'lemon', 'tomato']],
    preferredIngredients: ['tomato', 'onion'],
  },
  'afritada': {
    requiredAny: [['chicken', 'pork'], ['tomato sauce', 'tomato']],
    preferredIngredients: ['potato', 'carrot'],
  },
  'sarciadong-isda': {
    requiredAny: [['fish', 'chicken'], ['tomato', 'tomato sauce']],
    preferredIngredients: ['egg', 'onion'],
  },
  'sinigang-na-baka': {
    requiredAny: [['tamarind', 'calamansi', 'lemon']],
    preferredIngredients: ['tomato', 'onion'],
  },
  'sinigang-na-bangus': {
    requiredAny: [['tamarind', 'calamansi', 'lemon']],
    preferredIngredients: ['tomato', 'onion'],
  },
  'pork-sinigang-sa-miso': {
    requiredAny: [['tamarind', 'calamansi', 'lemon']],
    preferredIngredients: ['miso', 'tomato'],
  },
  'tinolang-manok': {
    requiredAny: [['chicken'], ['ginger']],
    preferredIngredients: ['green papaya', 'chili leaves'],
  },
  'tinolang-tahong': {
    requiredAny: [['mussels'], ['ginger']],
    preferredIngredients: ['water spinach', 'chili leaves'],
  },
  'tinolang-isda': {
    requiredAny: [['fish', 'milkfish'], ['ginger']],
    preferredIngredients: ['water spinach', 'onion'],
  },
  'nilagang-baboy': {
    requiredAny: [['pork'], ['cabbage', 'bok choy']],
    preferredIngredients: ['potato', 'onion'],
  },
  'nilagang-baka': {
    requiredAny: [['beef'], ['cabbage', 'bok choy']],
    preferredIngredients: ['potato', 'onion'],
  },
  'kare-kare': {
    requiredAny: [['peanut butter', 'peanuts']],
    preferredIngredients: ['eggplant', 'long beans'],
  },
  'menudo': {
    requiredAny: [['pork'], ['tomato sauce']],
    preferredIngredients: ['pork liver', 'potato'],
  },
  'pochero': {
    requiredAny: [['pork', 'chicken', 'beef'], ['banana']],
    preferredIngredients: ['cabbage', 'tomato sauce'],
  },
  'paksiw-na-lechon': {
    requiredAny: [['vinegar'], ['lechon', 'roast pork']],
    preferredIngredients: ['soy sauce', 'garlic'],
  },
  'paksiw-na-isda': {
    requiredAny: [['vinegar'], ['fish', 'milkfish', 'tilapia']],
    preferredIngredients: ['garlic', 'ginger'],
  },
  'paksiw-na-baboy': {
    requiredAny: [['vinegar'], ['pork', 'chicken']],
    preferredIngredients: ['soy sauce', 'garlic'],
  },
  'paksiw-na-bangus': {
    requiredAny: [['vinegar'], ['milkfish', 'tilapia']],
    preferredIngredients: ['garlic', 'ginger'],
  },
  'laing': {
    requiredAny: [['taro leaves'], ['coconut milk']],
    preferredIngredients: ['shrimp paste', 'chili'],
  },
  'pinakbet': {
    requiredAny: [['bitter melon', 'eggplant', 'long beans', 'squash'], ['shrimp paste']],
    preferredIngredients: ['tomato', 'okra'],
  },
  'arroz-caldo': {
    requiredAny: [['cooked rice', 'rice'], ['chicken', 'beef', 'pork']],
    preferredIngredients: ['ginger', 'garlic'],
  },
  'pancit-canton': {
    requiredAny: [['flour noodles']],
    excludedIfPresent: ['rice noodles', 'glass noodles'],
    preferredIngredients: ['cabbage', 'carrot'],
  },
  'pancit-bihon': {
    requiredAny: [['rice noodles']],
    excludedIfPresent: ['flour noodles', 'egg noodles'],
    preferredIngredients: ['cabbage', 'carrot'],
  },
  'pancit-palabok': {
    requiredAny: [['rice noodles']],
    excludedIfPresent: ['flour noodles', 'egg noodles', 'thick rice noodles'],
    preferredIngredients: ['shrimp paste', 'shrimp'],
  },
  'pancit-malabon': {
    requiredAny: [['thick rice noodles']],
    excludedIfPresent: ['flour noodles', 'egg noodles', 'rice noodles'],
    preferredIngredients: ['smoked fish', 'shrimp paste', 'shrimp'],
  },
  'pancit-luglug': {
    requiredAny: [['thick rice noodles']],
    excludedIfPresent: ['flour noodles', 'egg noodles', 'rice noodles'],
    preferredIngredients: ['shrimp paste', 'shrimp'],
  },
  'pancit-habhab': {
    requiredAny: [['flour noodles']],
    excludedIfPresent: ['rice noodles', 'thick rice noodles', 'egg noodles'],
    preferredIngredients: ['pork', 'cabbage'],
  },
  'pancit-bato': {
    requiredAny: [['pancit bato noodles']],
    excludedIfPresent: ['rice noodles', 'flour noodles', 'egg noodles'],
    preferredIngredients: ['pork', 'cabbage'],
  },
  'pancit-miki': {
    requiredAny: [['egg noodles']],
    excludedIfPresent: ['rice noodles', 'thick rice noodles', 'flour noodles'],
    preferredIngredients: ['chicken', 'cabbage'],
  },
  'pancit-chami': {
    requiredAny: [['egg noodles']],
    excludedIfPresent: ['rice noodles', 'thick rice noodles', 'flour noodles'],
    preferredIngredients: ['pork', 'cabbage'],
  },
  'garlic-butter-shrimp': {
    requiredAny: [['shrimp'], ['butter']],
    preferredIngredients: ['garlic'],
  },
}
