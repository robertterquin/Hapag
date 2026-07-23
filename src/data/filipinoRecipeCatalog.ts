export type DishAuthenticity = 'classic' | 'home-style' | 'hapag-adaptation'

export interface FilipinoRecipeSubstitution {
  ingredient: string
  substitute: string
  note: string
}

export interface FilipinoRecipeCatalogEntry {
  id: string
  name: string
  localName?: string
  authenticity: DishAuthenticity
  category: string
  requiredIngredients: string[]
  optionalIngredients: string[]
  commonSubstitutions: FilipinoRecipeSubstitution[]
  cookingMethod: string
  description: string
}

const substitute = (ingredient: string, replacement: string, note: string): FilipinoRecipeSubstitution => ({
  ingredient,
  substitute: replacement,
  note,
})

const dish = (
  id: string,
  name: string,
  category: string,
  requiredIngredients: string[],
  cookingMethod: string,
  description: string,
  optionalIngredients: string[] = [],
  commonSubstitutions: FilipinoRecipeSubstitution[] = [],
  localName?: string,
): FilipinoRecipeCatalogEntry => ({
  id,
  name,
  ...(localName ? { localName } : {}),
  authenticity: 'classic',
  category,
  requiredIngredients,
  optionalIngredients,
  commonSubstitutions,
  cookingMethod,
  description,
})

export const filipinoRecipeCatalog: FilipinoRecipeCatalogEntry[] = [
  dish('chicken-adobo', 'Chicken Adobo', 'simmered', ['chicken', 'garlic', 'soy sauce', 'vinegar'], 'simmer', 'Chicken braised in a savory soy-vinegar sauce.', ['bay leaf', 'black pepper', 'onion'], [substitute('chicken', 'pork', 'Use pork for a richer adobo.')], 'Adobong Manok'),
  dish('pork-adobo', 'Pork Adobo', 'simmered', ['pork', 'garlic', 'soy sauce', 'vinegar'], 'simmer', 'Pork slowly simmered in the classic adobo sauce.', ['bay leaf', 'black pepper', 'onion'], [substitute('pork', 'chicken', 'Chicken creates a lighter version.')], 'Adobong Baboy'),
  dish('adobong-kangkong', 'Adobong Kangkong', 'vegetable', ['water spinach', 'garlic', 'soy sauce', 'vinegar'], 'sauté and simmer', 'Water spinach cooked in a tangy adobo-style sauce.', ['onion', 'chili'], [], 'Adobong Kangkong'),
  dish('sinigang-na-baboy', 'Sinigang na Baboy', 'soup', ['pork', 'tamarind', 'tomato', 'onion'], 'boil and simmer', 'A sour Filipino pork soup with vegetables.', ['water spinach', 'radish', 'long beans', 'green chili'], [substitute('tamarind', 'calamansi', 'Calamansi gives a bright sour flavor.')]),
  dish('sinigang-na-hipon', 'Sinigang na Hipon', 'soup', ['shrimp', 'tamarind', 'tomato', 'onion'], 'boil and simmer', 'Sour tamarind soup with shrimp and vegetables.', ['water spinach', 'radish', 'long beans', 'green chili'], [substitute('shrimp', 'fish', 'Firm fish can be used instead.')]),
  dish('sinigang-na-isda', 'Sinigang na Isda', 'soup', ['fish', 'tamarind', 'tomato', 'onion'], 'boil and simmer', 'A tangy fish soup with fresh vegetables.', ['water spinach', 'radish', 'long beans', 'green chili'], [substitute('fish', 'shrimp', 'Shrimp makes a sweeter broth.')]),
  dish('tinolang-manok', 'Tinolang Manok', 'soup', ['chicken', 'ginger', 'onion', 'green papaya'], 'simmer', 'Gingered chicken soup with green papaya and leafy greens.', ['chili leaves', 'water spinach', 'fish sauce'], [substitute('green papaya', 'chayote', 'Chayote has a similar firm texture.')], 'Tinola'),
  dish('nilagang-baboy', 'Nilagang Baboy', 'soup', ['pork', 'potato', 'cabbage', 'onion'], 'boil', 'A clear pork soup with potatoes and vegetables.', ['corn', 'green beans', 'black pepper'], [substitute('pork', 'chicken', 'Chicken shortens the cooking time.')]),
  dish('nilagang-baka', 'Nilagang Baka', 'soup', ['beef', 'potato', 'cabbage', 'onion'], 'boil and simmer', 'Tender beef in a clear vegetable broth.', ['corn', 'green beans', 'black pepper'], [substitute('beef', 'pork', 'Pork is a faster-cooking option.')]),
  dish('bulalo', 'Bulalo', 'soup', ['beef shank', 'beef marrow bone', 'corn', 'cabbage'], 'slow simmer', 'A rich beef shank and marrow soup.', ['potato', 'green beans', 'onion', 'black pepper'], [substitute('beef shank', 'beef short rib', 'Short rib gives a similarly rich broth.')]),
  dish('kare-kare', 'Kare-Kare', 'stew', ['oxtail', 'peanut butter', 'eggplant', 'long beans'], 'braise and simmer', 'A thick peanut-based stew served with vegetables.', ['banana blossom', 'shrimp paste', 'bok choy'], [substitute('oxtail', 'beef stew meat', 'Stew meat is easier to source.')]),
  dish('kaldereta', 'Kaldereta', 'stew', ['beef', 'tomato sauce', 'potato', 'carrot'], 'braise and simmer', 'A hearty tomato-based meat stew.', ['bell pepper', 'liver spread', 'peas', 'chili'], [substitute('beef', 'chicken', 'Chicken creates a lighter kaldereta.')]),
  dish('menudo', 'Menudo', 'stew', ['pork', 'pork liver', 'tomato sauce', 'potato'], 'sauté and simmer', 'A tomato pork stew with small-cut vegetables.', ['carrot', 'bell pepper', 'peas', 'raisins'], [substitute('pork liver', 'chicken liver', 'Chicken liver has a milder flavor.')]),
  dish('afritada', 'Afritada', 'stew', ['chicken', 'tomato sauce', 'potato', 'carrot'], 'sauté and simmer', 'Chicken stewed in tomato sauce with vegetables.', ['bell pepper', 'peas', 'onion'], [substitute('chicken', 'pork', 'Pork works well with the same sauce.')]),
  dish('mechado', 'Mechado', 'stew', ['beef', 'tomato sauce', 'potato', 'soy sauce'], 'braise and simmer', 'Beef braised in a savory tomato-soy sauce.', ['carrot', 'bell pepper', 'onion', 'calamansi'], [substitute('beef', 'pork', 'Pork can be used for a quicker version.')]),
  dish('humba', 'Humba', 'braised', ['pork belly', 'soy sauce', 'vinegar', 'banana blossom'], 'braise and simmer', 'Sweet-savory braised pork with fermented depth.', ['black beans', 'brown sugar', 'bay leaf'], [substitute('pork belly', 'pork shoulder', 'Shoulder is leaner but remains tender.')]),
  dish('paksiw-na-lechon', 'Paksiw na Lechon', 'braised', ['lechon', 'vinegar', 'soy sauce', 'brown sugar'], 'simmer', 'Leftover roast pork braised in a sweet-tangy sauce.', ['bay leaf', 'garlic', 'banana ketchup'], [substitute('lechon', 'roast pork', 'Any cooked roast pork works.')]),
  dish('paksiw-na-isda', 'Paksiw na Isda', 'braised', ['fish', 'vinegar', 'garlic', 'ginger'], 'simmer', 'Fish gently cooked in vinegar with aromatics.', ['eggplant', 'bitter melon', 'green chili'], [substitute('fish', 'bangus', 'Milkfish is a traditional choice.')]),
  dish('daing-na-bangus', 'Daing na Bangus', 'fried', ['milkfish', 'vinegar', 'garlic'], 'marinate and fry', 'Milkfish marinated in vinegar and garlic, then fried.', ['black pepper', 'tomato', 'rice'], [substitute('milkfish', 'tilapia', 'Tilapia is a readily available alternative.')]),
  dish('escabeche', 'Escabeche', 'fried', ['fish', 'vinegar', 'carrot', 'bell pepper'], 'fry and sauce', 'Crisp fish topped with a sweet-and-sour vegetable sauce.', ['onion', 'ginger', 'sugar'], [substitute('fish', 'tilapia', 'Tilapia holds together well when fried.')]),
  dish('pesang-isda', 'Pesang Isda', 'soup', ['fish', 'ginger', 'cabbage', 'potato'], 'boil and simmer', 'A light ginger fish soup with vegetables.', ['pechay', 'onion', 'black pepper'], [substitute('fish', 'chicken', 'Chicken makes a similar ginger broth.')]),
  dish('bistek-tagalog', 'Bistek Tagalog', 'sautéed', ['beef', 'soy sauce', 'calamansi', 'onion'], 'marinate and sauté', 'Thin beef slices with soy-calamansi sauce and onions.', ['black pepper', 'garlic', 'rice'], [substitute('calamansi', 'lemon', 'Lemon provides a similar acidity.')]),
  dish('chicken-inasal', 'Chicken Inasal', 'grilled', ['chicken', 'calamansi', 'lemongrass', 'annatto'], 'marinate and grill', 'Visayan-style grilled chicken with citrus and aromatics.', ['ginger', 'garlic', 'coconut vinegar', 'oil'], [substitute('calamansi', 'lemon', 'Lemon can replace calamansi.')]),
  dish('lechon-manok', 'Lechon Manok', 'roasted', ['chicken', 'lemongrass', 'garlic', 'soy sauce'], 'marinate and roast', 'Filipino-style roasted chicken with aromatic stuffing.', ['onion', 'calamansi', 'black pepper'], [substitute('chicken', 'pork', 'Pork creates a different roast profile.')]),
  dish('pinakbet', 'Pinakbet', 'vegetable', ['bitter melon', 'eggplant', 'tomato', 'long beans'], 'sauté and simmer', 'Mixed vegetables cooked with tomato and savory bagoong flavor.', ['okra', 'squash', 'pork', 'shrimp paste'], [substitute('bitter melon', 'chayote', 'Chayote makes the dish milder.')]),
  dish('laing', 'Laing', 'vegetable', ['taro leaves', 'coconut milk', 'chili', 'shrimp paste'], 'simmer', 'Taro leaves slowly cooked in spicy coconut milk.', ['pork', 'garlic', 'ginger', 'onion'], [substitute('shrimp paste', 'fish sauce', 'Fish sauce keeps the savory character.')]),
  dish('ginisang-monggo', 'Ginisang Monggo', 'vegetable', ['mung beans', 'tomato', 'garlic', 'onion'], 'boil and sauté', 'Mung beans sautéed with aromatics and savory toppings.', ['pork', 'shrimp', 'malunggay', 'water spinach'], [substitute('mung beans', 'red beans', 'Red beans change the texture but remain hearty.')]),
  dish('ginisang-ampalaya', 'Ginisang Ampalaya', 'vegetable', ['bitter melon', 'egg', 'tomato', 'onion'], 'sauté', 'Bitter melon sautéed with egg and tomatoes.', ['garlic', 'ground pork', 'shrimp'], [substitute('bitter melon', 'zucchini', 'Zucchini creates a milder sauté.')]),
  dish('ginisang-sayote', 'Ginisang Sayote', 'vegetable', ['chayote', 'garlic', 'onion', 'tomato'], 'sauté', 'Simple sautéed chayote with Filipino aromatics.', ['egg', 'shrimp', 'ground pork'], [substitute('chayote', 'green papaya', 'Green papaya has a similar crisp bite.')]),
  dish('tortang-talong', 'Tortang Talong', 'egg', ['eggplant', 'egg', 'garlic', 'onion'], 'grill and pan-fry', 'Grilled eggplant coated in egg and pan-fried.', ['ground pork', 'tomato', 'green onion'], [substitute('eggplant', 'zucchini', 'Zucchini makes a different but workable fritter.')]),
  dish('lumpiang-shanghai', 'Lumpiang Shanghai', 'fried', ['ground pork', 'spring onion', 'carrot', 'lumpia wrapper'], 'roll and fry', 'Crisp fried spring rolls filled with seasoned pork.', ['garlic', 'onion', 'water chestnut'], [substitute('ground pork', 'ground chicken', 'Ground chicken makes a leaner filling.')]),
  dish('lumpiang-gulay', 'Lumpiang Gulay', 'vegetable', ['lumpia wrapper', 'carrot', 'cabbage', 'green beans'], 'sauté and fry', 'Vegetable spring rolls with a crisp wrapper.', ['bean sprouts', 'tofu', 'onion'], [substitute('lumpia wrapper', 'spring roll wrapper', 'Spring roll wrappers are a close match.')]),
  dish('pancit-canton', 'Pancit Canton', 'noodle', ['flour noodles', 'chicken', 'cabbage', 'carrot'], 'stir-fry', 'Stir-fried Filipino noodles with meat and vegetables.', ['shrimp', 'green beans', 'soy sauce', 'bell pepper'], [substitute('flour noodles', 'pancit bihon', 'Bihon creates a lighter noodle dish.')]),
  dish('pancit-bihon', 'Pancit Bihon', 'noodle', ['rice noodles', 'chicken', 'cabbage', 'carrot'], 'stir-fry', 'Rice noodles stir-fried with meat and vegetables.', ['shrimp', 'green beans', 'soy sauce', 'bell pepper'], [substitute('rice noodles', 'flour noodles', 'Canton noodles create a chewier version.')]),
  dish('arroz-caldo', 'Arroz Caldo', 'rice soup', ['rice', 'chicken', 'ginger', 'garlic'], 'boil and simmer', 'Comforting chicken and rice porridge with ginger.', ['safflower', 'green onion', 'calamansi', 'egg'], [substitute('chicken', 'pork', 'Pork creates a richer porridge.')]),
  dish('lugaw', 'Lugaw', 'rice soup', ['rice', 'ginger', 'garlic', 'fish sauce'], 'boil and simmer', 'Plain Filipino rice porridge with savory aromatics.', ['egg', 'chicken', 'green onion', 'calamansi'], [substitute('fish sauce', 'soy sauce', 'Soy sauce provides salty depth.')]),
  dish('champorado', 'Champorado', 'sweet rice', ['glutinous rice', 'cocoa', 'sugar'], 'boil and simmer', 'Sweet chocolate rice porridge served warm.', ['evaporated milk', 'condensed milk', 'salted fish'], [substitute('cocoa', 'tableya', 'Tableya gives a traditional chocolate flavor.')]),
  dish('tapsilog', 'Tapsilog', 'breakfast', ['beef tapa', 'egg', 'rice'], 'marinate and fry', 'Cured beef served with fried egg and garlic rice.', ['tomato', 'cucumber', 'vinegar'], [substitute('beef tapa', 'pork tocino', 'Tocino creates a sweeter breakfast plate.')]),
  dish('longsilog', 'Longsilog', 'breakfast', ['longganisa', 'egg', 'rice'], 'fry', 'Filipino sausage served with egg and garlic rice.', ['tomato', 'cucumber', 'vinegar'], [substitute('longganisa', 'chorizo', 'Chorizo provides a similar sausage element.')]),
  dish('tocilog', 'Tocilog', 'breakfast', ['pork tocino', 'egg', 'rice'], 'marinate and fry', 'Sweet cured pork served with egg and garlic rice.', ['tomato', 'cucumber', 'vinegar'], [substitute('pork tocino', 'longganisa', 'Longganisa makes a savory variation.')]),
  dish('filipino-style-spaghetti', 'Filipino-Style Spaghetti', 'pasta', ['spaghetti', 'ground pork', 'tomato sauce', 'banana ketchup'], 'boil and simmer', 'Sweet-savory spaghetti with Filipino-style meat sauce.', ['hotdog', 'cheese', 'onion', 'garlic'], [substitute('ground pork', 'ground beef', 'Ground beef gives a deeper sauce.')]),
  dish('sardines-with-egg', 'Sardines with Egg', 'quick meal', ['sardines', 'egg', 'garlic', 'onion'], 'sauté and scramble', 'A quick pantry-style sauté of sardines and egg.', ['tomato', 'green onion', 'chili'], [substitute('sardines', 'tuna', 'Canned tuna makes a milder version.')]),
  dish('sarciadong-isda', 'Sarciadong Isda', 'sautéed', ['fish', 'egg', 'tomato', 'onion'], 'fry and sauté', 'Fried fish finished with tomato, onion, and egg.', ['garlic', 'green onion', 'soy sauce'], [substitute('fish', 'leftover chicken', 'Leftover chicken can use the same sauce.')]),
  dish('ginisang-pechay-with-egg', 'Ginisang Pechay with Egg', 'vegetable', ['bok choy', 'egg', 'garlic', 'onion'], 'sauté', 'Tender bok choy sautéed with egg and aromatics.', ['tomato', 'oyster sauce', 'shrimp'], [substitute('bok choy', 'cabbage', 'Cabbage works well in the same sauté.')]),
  dish('ginataang-kalabasa-at-sitaw', 'Ginataang Kalabasa at Sitaw', 'vegetable', ['squash', 'long beans', 'coconut milk', 'garlic'], 'simmer', 'Squash and long beans cooked in coconut milk.', ['shrimp', 'pork', 'chili', 'onion'], [substitute('long beans', 'green beans', 'Green beans are a practical substitute.')]),
  dish('ginataang-gulay', 'Ginataang Gulay', 'vegetable', ['coconut milk', 'squash', 'eggplant', 'long beans'], 'simmer', 'Mixed vegetables simmered in creamy coconut milk.', ['shrimp', 'chili', 'bitter melon', 'okra'], [substitute('coconut milk', 'coconut cream', 'Coconut cream makes the sauce richer.')]),
  dish('ginataang-manok', 'Ginataang Manok', 'stew', ['chicken', 'coconut milk', 'ginger', 'garlic'], 'sauté and simmer', 'Chicken simmered in fragrant coconut milk.', ['chili', 'spinach', 'fish sauce', 'onion'], [substitute('chicken', 'pork', 'Pork creates a richer coconut stew.')]),
  dish('pinoy-style-burger-steak', 'Pinoy-Style Burger Steak', 'sautéed', ['ground beef', 'onion', 'mushroom', 'soy sauce'], 'pan-fry and simmer', 'Seasoned beef patties with savory mushroom-onion gravy.', ['oyster sauce', 'garlic', 'rice'], [substitute('ground beef', 'ground pork', 'Ground pork makes a softer patty.')]),
  dish('embutido', 'Embutido', 'steamed', ['ground pork', 'egg', 'carrot', 'bell pepper'], 'mix and steam', 'Filipino steamed meatloaf with vegetables and egg.', ['raisins', 'hotdog', 'cheese', 'bread crumbs'], [substitute('ground pork', 'ground chicken', 'Ground chicken creates a lighter loaf.')]),
  dish('morcon', 'Morcon', 'braised', ['beef', 'hotdog', 'egg', 'cheese'], 'roll and braise', 'Rolled beef stuffed with savory Filipino-style fillings.', ['carrot', 'pickle', 'tomato sauce', 'onion'], [substitute('beef', 'pork', 'Pork can be rolled and braised similarly.')]),
]

export function validateFilipinoRecipeCatalog(entries: FilipinoRecipeCatalogEntry[] = filipinoRecipeCatalog) {
  if (entries.length !== 50) throw new Error(`Expected 50 catalog entries, received ${entries.length}.`)

  const ids = new Set<string>()
  const names = new Set<string>()
  const ingredients = new Set(entries.flatMap((entry) => [...entry.requiredIngredients, ...entry.optionalIngredients]))

  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id)) throw new Error(`Catalog entry IDs must be unique: ${entry.id}`)
    if (!entry.name || names.has(entry.name.toLowerCase())) throw new Error(`Catalog dish names must be unique: ${entry.name}`)
    if (entry.requiredIngredients.length === 0) throw new Error(`Catalog entry has no required ingredients: ${entry.id}`)
    if (!['classic', 'home-style', 'hapag-adaptation'].includes(entry.authenticity)) throw new Error(`Invalid authenticity for ${entry.id}`)
    const allIngredients = [...entry.requiredIngredients, ...entry.optionalIngredients]
    if (allIngredients.some((ingredient) => !ingredient.trim())) throw new Error(`Catalog entry has an empty ingredient: ${entry.id}`)
    for (const replacement of entry.commonSubstitutions) {
      if (!ingredients.has(replacement.ingredient) || !replacement.substitute.trim()) {
        throw new Error(`Invalid substitution in catalog entry: ${entry.id}`)
      }
    }
    ids.add(entry.id)
    names.add(entry.name.toLowerCase())
  }

  return entries
}

validateFilipinoRecipeCatalog()
