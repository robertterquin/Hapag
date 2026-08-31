import type { NormalizedIngredient } from '../types/domain.ts'

export interface MascotBanter {
  tag: string
  headline: string
  subline: string
  tip?: string
}

export function getMascotLoadingBanter(ingredients: NormalizedIngredient[] = [], rawInput = ''): MascotBanter[] {
  const canonicalNames = new Set(ingredients.map((i) => i.canonicalName.toLowerCase()))
  const rawLower = (rawInput + ' ' + ingredients.map((i) => i.name).join(' ')).toLowerCase()

  const has = (name: string) => canonicalNames.has(name) || rawLower.includes(name)
  const hasAny = (...names: string[]) => names.some((n) => has(n))

  const banters: MascotBanter[] = []

  if (hasAny('chicken', 'pork', 'pork belly', 'pork shoulder', 'manok', 'baboy') && hasAny('soy sauce', 'vinegar', 'toyo', 'suka', 'garlic', 'bawang')) {
    banters.push({
      tag: 'Adobo Vibe',
      headline: 'Smells like savory Adobo in here!',
      subline: 'Chef Kalabaw is searing garlic and soy sauce for a rich, savory glaze.',
      tip: "Chef's Tip: Don't stir the vinegar immediately after adding it to let the acidity mellow naturally.",
    })
    banters.push({
      tag: 'Filipino Seasoning',
      headline: 'Balancing the soy sauce and vinegar ratio…',
      subline: 'Checking whether a saucy or dry-style adobo works best for your ingredients.',
      tip: 'Adobo tastes even deeper when allowed to simmer gently on low heat!',
    })
  }

  if (hasAny('fish', 'tilapia', 'milkfish', 'bangus', 'isda') && (hasAny('tomato', 'kamatis', 'onion', 'sibuyas', 'egg', 'itlog') || has('vinegar') || has('suka'))) {
    banters.push({
      tag: 'Fresh Catch',
      headline: 'Fresh fish and tomatoes? Sarciado or Paksiw coming right up!',
      subline: 'Creating a recipe that keeps the fish tender, juicy, and full of flavor.',
      tip: "Chef's Tip: Lightly fry the fish first before simmering in sauce so it doesn't break apart.",
    })
    banters.push({
      tag: 'Seafood Savory',
      headline: 'Sautéing fresh aromatics for the fish…',
      subline: 'Reducing the tomato sauce to coat the fish perfectly.',
    })
  }

  if (hasAny('tamarind', 'sampalok', 'sinigang mix', 'calamansi', 'kamias') || (hasAny('shrimp', 'pork', 'milkfish', 'bangus', 'tilapia') && hasAny('kangkong', 'radish', 'labanos', 'gabi', 'taro'))) {
    banters.push({
      tag: 'Sour Soup',
      headline: 'Tamarind sour broth—a classic family favorite!',
      subline: 'The clay pot is boiling! Balancing the tangy tamarind broth with savory aromatics.',
      tip: "Chef's Tip: Add leafy greens like water spinach in the final minute so they stay bright and crisp.",
    })
    banters.push({
      tag: 'Kitchen Comfort',
      headline: 'Preparing a comforting, tangy broth…',
      subline: 'Matching the best vegetable and protein balance for a hearty soup.',
    })
  }

  if (hasAny('coconut milk', 'gata', 'niyog', 'coconut cream') || (hasAny('chili', 'sili', 'siling haba', 'siling labuyo') && hasAny('pork', 'squash', 'kalabasa', 'sitaw', 'shrimp'))) {
    banters.push({
      tag: 'Creamy Ginataan',
      headline: 'Rich and creamy coconut stew in progress!',
      subline: 'Simmering fresh coconut milk with aromatics to render its natural oil.',
      tip: "Chef's Tip: Keep heat on medium-low and stir gently to prevent coconut milk from curdling.",
    })
    banters.push({
      tag: 'Bicolano Heat',
      headline: 'Infusing creamy coconut sauce with subtle chili warmth…',
      subline: 'The perfect pairing for hot steamed rice!',
    })
  }

  if (hasAny('sardines', 'sardinas', 'corned beef', 'tuna', 'canned meat', 'luncheon meat', 'spam')) {
    banters.push({
      tag: 'Pantry Upgrade',
      headline: 'Turning quick pantry staples into a gourmet home meal!',
      subline: 'Chef Kalabaw is sautéing with garlic, onions, and greens for extra nutrition.',
      tip: "Chef's Tip: Squeeze a touch of calamansi or add sliced chili to brighten canned goods instantly.",
    })
    banters.push({
      tag: 'Quick Cooking',
      headline: 'Upgrading your pantry staples with fresh sautéed aromatics…',
      subline: 'Crafting a fast, delicious, and budget-friendly meal!',
    })
  }

  if (hasAny('tomato sauce', 'tomato paste', 'liver spread', 'cheese') || (hasAny('pork', 'beef', 'chicken') && hasAny('potato', 'patatas', 'carrot', 'carrots', 'bell pepper', 'peas'))) {
    banters.push({
      tag: 'Savory Stew',
      headline: 'Simmering a rich, celebratory tomato stew!',
      subline: 'Gently braising tender meat with potatoes, carrots, and sweet bell peppers.',
      tip: "Chef's Tip: Simmering potatoes in the stew naturally thickens the sauce to velvety perfection.",
    })
    banters.push({
      tag: 'Rich Braise',
      headline: 'Simmering a deep and savory stew sauce…',
      subline: 'Evaluating whether Menudo, Afritada, or Mechado best suits your pantry.',
    })
  }

  if (hasAny('bihon', 'canton noodles', 'flour noodles', 'egg noodles', 'miki', 'sotanghon', 'glass noodles', 'macaroni')) {
    banters.push({
      tag: 'Pancit Special',
      headline: 'Stir-frying savory noodles with crisp vegetables!',
      subline: 'Letting the noodles absorb every drop of the seasoned broth.',
      tip: "Chef's Tip: Do not oversaturate with liquid—let noodles cook through absorption for the best bite.",
    })
  }

  if (hasAny('ginger', 'luya', 'chayote', 'sayote', 'green papaya', 'papaya', 'malunggay', 'rice', 'glutinous rice')) {
    banters.push({
      tag: 'Ginger Broth',
      headline: 'Fragrant ginger and garlic broth simmering on the stove!',
      subline: 'A warm, soothing soup crafted by Chef Kalabaw.',
      tip: "Chef's Tip: Lightly bruise ginger before sautéing to release maximum aromatics into the broth.",
    })
  }

  if (has('egg') || has('itlog')) {
    if (hasAny('eggplant', 'talong', 'ground pork', 'giniling', 'potato', 'patatas')) {
      banters.push({
        tag: 'Classic Torta',
        headline: 'Smoky grilled eggplant coated in savory beaten egg!',
        subline: 'Pan-frying until golden brown with crisp edges and a tender center.',
        tip: "Chef's Tip: Prick eggplant with a fork before roasting for effortless skin peeling.",
      })
    }
  }

  if (hasAny('tofu', 'tokwa', 'kangkong', 'sitaw', 'pechay', 'bok choy', 'repolyo', 'cabbage', 'okra', 'ampalaya')) {
    banters.push({
      tag: 'Fresh Greens',
      headline: 'Nutritious and vibrant sautéed vegetables!',
      subline: 'Quickly tossing over medium heat to maintain crisp texture and vivid color.',
      tip: "Chef's Tip: Avoid covering green vegetables for too long to preserve their bright color.",
    })
  }

  if (banters.length === 0) {
    const firstItemName = ingredients[0]?.name ?? 'your ingredients'
    banters.push({
      tag: "Chef's Kitchen",
      headline: `Seasoning the clay pot with ${firstItemName}!`,
      subline: 'Chef Kalabaw is crafting delicious and practical cooking methods for you.',
      tip: "Chef's Tip: The foundation of great flavor starts with properly sautéed garlic and onions.",
    })
    banters.push({
      tag: 'Preparing Recipes',
      headline: 'Discovering 3 authentic meal options…',
      subline: 'Tailoring each dish to your budget, servings, and pantry.',
    })
  }

  banters.push({
    tag: 'Almost Ready',
    headline: 'Finalizing 3 delicious recipe choices for your table!',
    subline: 'Double-checking cooking steps, measurements, and substitution tradeoffs.',
  })

  return banters
}

