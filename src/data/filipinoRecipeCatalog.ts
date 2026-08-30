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
  mealType: CatalogMealType
  region: CatalogRegion
  verificationStatus: CatalogVerificationStatus
  essentialIngredients: string[]
}

export type CatalogMealType =
  | 'main-dish'
  | 'soup'
  | 'stew'
  | 'noodle-dish'
  | 'rice-meal'
  | 'vegetable-dish'
  | 'breakfast'

export type CatalogRegion = 'Luzon' | 'Visayas' | 'Mindanao' | 'National'
export type CatalogVerificationStatus = 'reviewed' | 'needs-review'

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
): Omit<FilipinoRecipeCatalogEntry, 'mealType' | 'region' | 'verificationStatus' | 'essentialIngredients'> => ({
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

const rawFilipinoRecipeCatalog = [
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
  dish('kare-kare', 'Kare-Kare', 'stew', ['oxtail', 'peanut butter', 'eggplant', 'long beans'], 'braise and simmer', 'A thick peanut-based stew served with vegetables.', ['banana blossom', 'shrimp paste', 'bok choy'], [substitute('oxtail', 'beef stew meat', 'Stew meat is easier to source.'), substitute('oxtail', 'pork', 'Pork creates a home-style Kare-Kare variation.')]),
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
  dish('arroz-caldo', 'Arroz Caldo', 'rice soup', ['cooked rice', 'chicken', 'ginger', 'garlic'], 'boil and simmer', 'Comforting chicken and rice porridge with ginger.', ['safflower', 'green onion', 'calamansi', 'egg'], [substitute('chicken', 'pork', 'Pork creates a richer porridge.')]),
  dish('lugaw', 'Lugaw', 'rice soup', ['cooked rice', 'ginger', 'garlic', 'fish sauce'], 'boil and simmer', 'Plain Filipino rice porridge with savory aromatics.', ['egg', 'chicken', 'green onion', 'calamansi'], [substitute('fish sauce', 'soy sauce', 'Soy sauce provides salty depth.')]),
  dish('champorado', 'Champorado', 'sweet rice', ['glutinous rice', 'cocoa', 'sugar'], 'boil and simmer', 'Sweet chocolate rice porridge served warm.', ['evaporated milk', 'condensed milk', 'salted fish'], [substitute('cocoa', 'tableya', 'Tableya gives a traditional chocolate flavor.')]),
  dish('tapsilog', 'Tapsilog', 'breakfast', ['beef tapa', 'egg', 'cooked rice'], 'marinate and fry', 'Cured beef served with fried egg and garlic rice.', ['tomato', 'cucumber', 'vinegar'], [substitute('beef tapa', 'pork tocino', 'Tocino creates a sweeter breakfast plate.')]),
  dish('longsilog', 'Longsilog', 'breakfast', ['longganisa', 'egg', 'cooked rice'], 'fry', 'Filipino sausage served with egg and garlic rice.', ['tomato', 'cucumber', 'vinegar'], [substitute('longganisa', 'chorizo', 'Chorizo provides a similar sausage element.')]),
  dish('tocilog', 'Tocilog', 'breakfast', ['pork tocino', 'egg', 'cooked rice'], 'marinate and fry', 'Sweet cured pork served with egg and garlic rice.', ['tomato', 'cucumber', 'vinegar'], [substitute('pork tocino', 'longganisa', 'Longganisa makes a savory variation.')]),
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
  dish('garlic-butter-shrimp', 'Garlic Butter Shrimp', 'quick meal', ['shrimp', 'garlic', 'butter'], 'sauté', 'Shrimp quickly sautéed in fragrant garlic butter.', ['calamansi', 'lemon', 'chili', 'parsley'], [substitute('shrimp', 'chicken', 'Chicken creates a different but quick garlic-butter dish.')], 'Hipon sa Bawang at Mantikilya'),
  dish('sisig', 'Sisig', 'sautéed', ['pork face', 'onion', 'calamansi'], 'boil and grill', 'Chopped seasoned pork finished with onion and calamansi.', ['chili', 'mayonnaise', 'egg'], [substitute('pork face', 'pork belly', 'Pork belly makes a richer, easier-to-source sisig.')]),
  dish('chicken-sisig', 'Chicken Sisig', 'sautéed', ['chicken', 'onion', 'calamansi'], 'grill and sauté', 'Crisp chopped chicken seasoned like Filipino sisig.', ['chili', 'mayonnaise', 'egg'], [substitute('chicken', 'pork', 'Pork gives the more traditional sisig profile.')]),
  dish('crispy-pata', 'Crispy Pata', 'fried', ['pork leg', 'garlic', 'soy sauce'], 'boil and deep-fry', 'Crispy fried pork leg served with a savory dipping sauce.', ['vinegar', 'onion', 'black pepper'], [substitute('pork leg', 'pork belly', 'Pork belly can be fried for a smaller serving.')]),
  dish('lechon-kawali', 'Lechon Kawali', 'fried', ['pork belly', 'garlic', 'oil'], 'boil and deep-fry', 'Crisp-fried pork belly with a Filipino dipping sauce.', ['vinegar', 'soy sauce', 'bay leaf'], [substitute('pork belly', 'pork shoulder', 'Shoulder is leaner but can still be crisped.')]),
  dish('chicharon-baboy', 'Chicharon Baboy', 'fried', ['pork rind', 'oil', 'salt'], 'boil and deep-fry', 'Crisp pork rind seasoned simply with salt.', ['vinegar', 'garlic', 'chili'], [substitute('pork rind', 'pork belly', 'Pork belly produces a meatier fried snack.')]),
  dish('binagoongan-baboy', 'Binagoongang Baboy', 'stew', ['pork', 'shrimp paste', 'tomato'], 'sauté and simmer', 'Pork cooked with salty fermented shrimp paste and tomato.', ['garlic', 'onion', 'chili', 'vinegar'], [substitute('shrimp paste', 'fish sauce', 'Fish sauce supplies savory saltiness.')]),
  dish('bicol-express', 'Bicol Express', 'stew', ['pork', 'coconut milk', 'shrimp paste', 'chili'], 'sauté and simmer', 'Spicy pork simmered in coconut milk with shrimp paste.', ['garlic', 'onion', 'ginger'], [substitute('pork', 'chicken', 'Chicken makes a lighter coconut-based stew.')]),
  dish('dinuguan', 'Dinuguan', 'stew', ['pork', 'pork blood', 'vinegar', 'chili'], 'simmer', 'Savory pork stew thickened with blood and sharpened with vinegar.', ['garlic', 'onion', 'intestine'], [substitute('pork blood', 'coconut milk', 'Coconut milk creates a different but rich stew.')]),
  dish('batchoy', 'Batchoy', 'noodle soup', ['pork', 'egg noodles', 'pork liver', 'garlic'], 'boil and simmer', 'Rich noodle soup topped with pork, liver, and fried garlic.', ['shrimp', 'green onion', 'pork cracklings'], [substitute('egg noodles', 'flour noodles', 'Flour noodles are a practical noodle substitute.')]),
  dish('mami', 'Pancit Mami', 'noodle soup', ['egg noodles', 'chicken', 'garlic', 'green onion'], 'boil and simmer', 'Warm Filipino noodle soup with chicken and aromatic broth.', ['pork', 'egg', 'cabbage'], [substitute('chicken', 'pork', 'Pork creates a richer noodle broth.')]),
  dish('goto', 'Goto', 'rice soup', ['rice', 'beef tripe', 'ginger', 'garlic'], 'boil and simmer', 'Savory rice porridge with tender beef tripe and ginger.', ['egg', 'green onion', 'calamansi'], [substitute('beef tripe', 'beef', 'Beef makes a simpler version of the porridge.')]),
  dish('tokwa-baboy', 'Tokwa’t Baboy', 'appetizer', ['tofu', 'pork', 'vinegar', 'soy sauce'], 'boil and grill', 'Tofu and pork dressed with a bright soy-vinegar sauce.', ['onion', 'garlic', 'chili'], [substitute('pork', 'mushroom', 'Mushroom makes a meat-free variation.')]),
  dish('ensaladang-talong', 'Ensaladang Talong', 'salad', ['eggplant', 'tomato', 'onion', 'vinegar'], 'grill and toss', 'Smoky eggplant salad with tomato, onion, and vinegar.', ['salted egg', 'fish sauce'], [substitute('eggplant', 'cucumber', 'Cucumber makes a crisp fresh salad.')]),
  dish('ensaladang-mangga', 'Ensaladang Mangga', 'salad', ['green mango', 'tomato', 'onion', 'vinegar'], 'slice and toss', 'Fresh green mango salad with a sweet-sour dressing.', ['shrimp paste', 'salted egg', 'chili'], [substitute('green mango', 'cucumber', 'Cucumber makes a milder crunchy salad.')]),
  dish('ginataang-tilapia', 'Ginataang Tilapia', 'stew', ['tilapia', 'coconut milk', 'ginger', 'garlic'], 'simmer', 'Tilapia simmered in fragrant coconut milk.', ['chili', 'pechay', 'onion'], [substitute('tilapia', 'milkfish', 'Milkfish works well in coconut milk.')]),
  dish('sinigang-na-manok', 'Sinigang na Manok', 'soup', ['chicken', 'tamarind', 'tomato', 'onion'], 'boil and simmer', 'Sour chicken soup with Filipino vegetables.', ['water spinach', 'radish', 'long beans'], [substitute('chicken', 'pork', 'Pork makes the more familiar sinigang variation.')]),
  dish('sinigang-na-baka', 'Sinigang na Baka', 'soup', ['beef', 'tamarind', 'tomato', 'onion'], 'boil and simmer', 'Sour beef soup with vegetables and a rich broth.', ['water spinach', 'radish', 'long beans'], [substitute('beef', 'pork', 'Pork cooks faster in sour broth.')]),
  dish('sinigang-na-bangus', 'Sinigang na Bangus', 'soup', ['milkfish', 'tamarind', 'tomato', 'onion'], 'boil and simmer', 'Tamarind soup with milkfish and vegetables.', ['water spinach', 'radish', 'long beans'], [substitute('milkfish', 'tilapia', 'Tilapia is a milder fish option.')]),
  dish('ginataang-hipon', 'Ginataang Hipon', 'stew', ['shrimp', 'coconut milk', 'garlic', 'chili'], 'simmer', 'Shrimp simmered in creamy coconut milk with aromatics.', ['squash', 'long beans', 'ginger'], []),
  dish('halabos-na-hipon', 'Halabos na Hipon', 'quick meal', ['shrimp', 'garlic', 'oil'], 'steam and sauté', 'Shrimp cooked simply with garlic and a little liquid.', ['chili', 'calamansi', 'butter'], []),
  dish('camaron-rebosado', 'Camaron Rebosado', 'fried', ['shrimp', 'flour', 'egg', 'oil'], 'batter and fry', 'Battered and fried shrimp served with a dipping sauce.', ['cornstarch', 'lemon', 'garlic'], []),
  dish('rellenong-bangus', 'Rellenong Bangus', 'stuffed', ['milkfish', 'egg', 'carrot', 'onion'], 'stuff and bake', 'Milkfish stuffed with seasoned fish and vegetables.', ['raisins', 'bell pepper', 'garlic'], [substitute('milkfish', 'tilapia', 'Tilapia can be used for a smaller stuffed fish.')]),
  dish('adobong-pusit', 'Adobong Pusit', 'simmered', ['squid', 'garlic', 'soy sauce', 'vinegar'], 'simmer', 'Squid cooked quickly in a dark soy-vinegar adobo sauce.', ['onion', 'chili', 'tomato'], []),
  dish('ginataang-pusit', 'Ginataang Pusit', 'stew', ['squid', 'coconut milk', 'garlic', 'chili'], 'simmer', 'Squid simmered in spicy coconut milk.', ['ginger', 'onion', 'tomato'], []),
  dish('daing-na-isda', 'Daing na Isda', 'fried', ['fish', 'vinegar', 'garlic', 'salt'], 'marinate and fry', 'Fish marinated in vinegar and garlic before frying.', ['black pepper', 'tomato', 'rice'], [substitute('fish', 'milkfish', 'Milkfish is a traditional choice for daing.')]),
  dish('tortang-giniling', 'Tortang Giniling', 'egg', ['ground pork', 'egg', 'potato', 'carrot'], 'sauté and pan-fry', 'Seasoned ground pork and vegetables bound in egg.', ['onion', 'garlic', 'bell pepper'], [substitute('ground pork', 'ground chicken', 'Ground chicken creates a leaner omelet.')]),
  dish('corned-beef-silog', 'Corned Beef Silog', 'breakfast', ['corned beef', 'egg', 'rice'], 'sauté and fry', 'Sautéed corned beef served with fried egg and garlic rice.', ['garlic', 'tomato', 'onion'], [substitute('corned beef', 'canned sardines', 'Canned sardines make a quick pantry silog.')]),
  dish('bangsilog', 'Bangsilog', 'breakfast', ['milkfish', 'egg', 'rice'], 'fry', 'Fried milkfish served with egg and garlic rice.', ['tomato', 'cucumber', 'vinegar'], [substitute('milkfish', 'tuna', 'Tuna makes a convenient fish breakfast plate.')]),
  dish('daing-na-bangus-silog', 'Daing na Bangus Silog', 'breakfast', ['milkfish', 'egg', 'rice', 'vinegar'], 'marinate and fry', 'Vinegar-marinated milkfish served as a silog breakfast.', ['garlic', 'tomato', 'cucumber'], [substitute('milkfish', 'tilapia', 'Tilapia is a readily available alternative.')]),
  dish('pancit-palabok', 'Pancit Palabok', 'noodle', ['rice noodles', 'shrimp', 'shrimp paste', 'egg'], 'boil and assemble', 'Rice noodles topped with savory shrimp sauce and Filipino garnishes.', ['pork cracklings', 'green onion', 'calamansi'], [substitute('shrimp', 'smoked fish', 'Smoked fish creates a different but savory topping.')]),
  dish('pancit-bato', 'Pancit Bato', 'noodle', ['pancit bato noodles', 'pork', 'cabbage', 'carrot'], 'stir-fry', 'Firm regional noodles stir-fried with meat and vegetables.', ['shrimp', 'green beans', 'soy sauce'], [substitute('pork', 'chicken', 'Chicken creates a lighter noodle dish.')]),
  dish('pancit-miki', 'Pancit Miki', 'noodle', ['egg noodles', 'chicken', 'cabbage', 'soy sauce'], 'stir-fry', 'Fresh egg noodles cooked with chicken and vegetables.', ['shrimp', 'carrot', 'green beans'], [substitute('chicken', 'pork', 'Pork gives a richer stir-fried noodle dish.')]),
  dish('dinakdakan', 'Dinakdakan', 'appetizer', ['pork face', 'onion', 'vinegar'], 'boil and grill', 'Ilocano chopped pork dish with a tangy savory dressing.', ['chili', 'mayonnaise', 'ginger'], [substitute('pork face', 'pork belly', 'Pork belly is easier to source for a home-style version.')]),
  dish('pinapaitan', 'Pinapaitan', 'soup', ['beef', 'bitter melon', 'ginger', 'vinegar'], 'boil and simmer', 'Bitter and savory Ilocano soup with beef and aromatics.', ['beef tripe', 'chili', 'onion'], [substitute('beef', 'goat', 'Goat is a traditional alternative protein.')]),
  dish('kansi', 'Kansi', 'soup', ['beef shank', 'jackfruit', 'tamarind', 'lemongrass'], 'boil and simmer', 'Sour beef soup combining fruit and aromatic broth.', ['annatto', 'onion', 'chili'], [substitute('beef shank', 'beef short rib', 'Short rib gives a similarly rich broth.')]),
  dish('pochero', 'Pochero', 'stew', ['pork', 'tomato sauce', 'banana', 'cabbage'], 'boil and simmer', 'Tomato-based stew with pork, saba banana, and vegetables.', ['potato', 'green beans', 'chorizo'], [substitute('pork', 'chicken', 'Chicken makes a lighter pochero.')]),
  dish('chicken-pastel', 'Chicken Pastel', 'pie', ['chicken', 'mushroom', 'milk', 'carrot'], 'sauté and bake', 'Creamy chicken and vegetables served under a pastry crust.', ['potato', 'peas', 'pie crust'], [substitute('chicken', 'pork', 'Pork creates a savory pastel variation.')]),
  dish('chicken-barbecue', 'Chicken Barbecue', 'grilled', ['chicken', 'soy sauce', 'brown sugar', 'calamansi'], 'marinate and grill', 'Sweet-savory Filipino grilled chicken skewers.', ['garlic', 'banana ketchup', 'black pepper'], [substitute('chicken', 'pork', 'Pork is commonly grilled with the same marinade.')]),
  dish('pork-barbecue', 'Pork Barbecue', 'grilled', ['pork', 'soy sauce', 'brown sugar', 'garlic'], 'marinate and grill', 'Sweet-savory grilled pork skewers.', ['banana ketchup', 'calamansi', 'black pepper'], [substitute('pork', 'chicken', 'Chicken makes a lighter barbecue skewer.')]),
  dish('grilled-liempo', 'Grilled Liempo', 'grilled', ['pork belly', 'soy sauce', 'calamansi', 'garlic'], 'marinate and grill', 'Grilled pork belly with a bright soy-calamansi marinade.', ['brown sugar', 'black pepper', 'vinegar'], [substitute('pork belly', 'pork shoulder', 'Shoulder is leaner but grills well when marinated.')]),
  dish('chicken-binakol', 'Chicken Binakol', 'soup', ['chicken', 'coconut water', 'ginger', 'lemongrass'], 'boil and simmer', 'Visayan chicken soup cooked with coconut water and aromatics.', ['young coconut', 'papaya', 'malunggay'], [substitute('chicken', 'pork', 'Pork creates a richer coconut broth.')]),
  dish('sinampalukang-manok', 'Sinampalukang Manok', 'soup', ['chicken', 'tamarind', 'ginger', 'onion'], 'boil and simmer', 'Sour chicken soup with young tamarind leaves and aromatics.', ['tamarind leaves', 'chili', 'water spinach'], [substitute('chicken', 'pork', 'Pork makes a heartier sour soup.')]),
  dish('chicken-curry', 'Filipino Chicken Curry', 'stew', ['chicken', 'coconut milk', 'potato', 'carrot'], 'sauté and simmer', 'Filipino-style chicken curry with coconut milk and vegetables.', ['curry powder', 'bell pepper', 'onion'], [substitute('chicken', 'pork', 'Pork works well in the same coconut curry.')]),
  dish('adobong-manok-sa-gata', 'Adobong Manok sa Gata', 'simmered', ['chicken', 'soy sauce', 'vinegar', 'coconut milk'], 'simmer', 'Chicken adobo enriched with creamy coconut milk.', ['garlic', 'chili', 'bay leaf'], [substitute('chicken', 'pork', 'Pork creates a richer coconut adobo.')]),
  dish('halang-halang-na-manok', 'Halang-Halang na Manok', 'stew', ['chicken', 'ginger', 'chili', 'coconut milk'], 'sauté and simmer', 'Spicy Visayan chicken stew with coconut milk and ginger.', ['lemongrass', 'garlic', 'onion'], [substitute('chicken', 'pork', 'Pork makes a richer spicy stew.')]),
  dish('inubarang-manok', 'Inubarang Manok', 'stew', ['chicken', 'banana blossom', 'coconut milk', 'ginger'], 'simmer', 'Chicken simmered with banana blossom and coconut milk.', ['lemongrass', 'chili', 'garlic'], [substitute('chicken', 'pork', 'Pork is a suitable coconut-stew substitute.')]),
  dish('kinulob-na-manok', 'Kinulob na Manok', 'braised', ['chicken', 'potato', 'soy sauce', 'garlic'], 'braise', 'Tender chicken braised with potatoes and savory aromatics.', ['onion', 'bay leaf', 'black pepper'], [substitute('chicken', 'pork', 'Pork can be braised using the same aromatics.')]),
  dish('pinaupong-manok', 'Pinaupong Manok', 'steamed', ['chicken', 'salt', 'ginger', 'lemongrass'], 'steam', 'Whole chicken steamed over salt with fragrant aromatics.', ['garlic', 'onion', 'black pepper'], [substitute('chicken', 'pork', 'Pork requires a longer cooking time.')]),
  dish('pork-hamonado', 'Pork Hamonado', 'braised', ['pork', 'pineapple', 'brown sugar', 'soy sauce'], 'braise', 'Sweet-savory pork braised with pineapple.', ['garlic', 'onion', 'black pepper'], [substitute('pork', 'chicken', 'Chicken makes a lighter hamonado.')]),
  dish('pork-estofado', 'Pork Estofado', 'braised', ['pork', 'vinegar', 'soy sauce', 'banana'], 'braise', 'Tender pork braised with vinegar, soy sauce, and saba banana.', ['brown sugar', 'garlic', 'bay leaf'], [substitute('pork', 'chicken', 'Chicken cooks faster in the same sauce.')]),
  dish('paksiw-na-baboy', 'Paksiw na Baboy', 'braised', ['pork', 'vinegar', 'garlic', 'soy sauce'], 'simmer', 'Pork simmered in a tangy vinegar and soy sauce broth.', ['banana blossom', 'brown sugar', 'bay leaf'], [substitute('pork', 'chicken', 'Chicken creates a lighter paksiw.')]),
  dish('sinugba-na-baboy', 'Sinugba na Baboy', 'grilled', ['pork belly', 'soy sauce', 'calamansi', 'garlic'], 'marinate and grill', 'Grilled Visayan pork belly with a bright dipping sauce.', ['vinegar', 'chili', 'onion'], [substitute('pork belly', 'pork shoulder', 'Shoulder is leaner but grills well.')]),
  dish('beef-pares', 'Beef Pares', 'braised', ['beef', 'soy sauce', 'brown sugar', 'ginger'], 'braise and simmer', 'Sweet-savory braised beef served with garlic rice.', ['star anise', 'garlic', 'green onion'], [substitute('beef', 'pork', 'Pork makes a faster braised meal.')]),
  dish('beef-tapa', 'Beef Tapa', 'breakfast', ['beef', 'soy sauce', 'sugar', 'garlic'], 'marinate and fry', 'Cured sweet-savory beef served as a Filipino breakfast meal.', ['vinegar', 'black pepper', 'rice'], [substitute('beef', 'pork', 'Pork creates a different cured breakfast meat.')]),
  dish('kambing-kaldereta', 'Kalderetang Kambing', 'stew', ['goat', 'tomato sauce', 'potato', 'carrot'], 'braise and simmer', 'Goat meat stewed in a rich tomato-based sauce.', ['liver spread', 'bell pepper', 'chili'], [substitute('goat', 'beef', 'Beef is a familiar alternative for kaldereta.')]),
  dish('nilagang-kambing', 'Nilagang Kambing', 'soup', ['goat', 'cabbage', 'potato', 'onion'], 'boil and simmer', 'Clear goat soup with potatoes and vegetables.', ['corn', 'black pepper', 'green beans'], [substitute('goat', 'beef', 'Beef creates a similarly hearty clear soup.')]),
  dish('chicken-pochero', 'Chicken Pochero', 'stew', ['chicken', 'tomato sauce', 'banana', 'cabbage'], 'boil and simmer', 'Chicken pochero with saba banana and vegetables.', ['potato', 'green beans', 'chorizo'], [substitute('chicken', 'pork', 'Pork is a traditional pochero protein.')]),
  dish('pork-sinigang-sa-miso', 'Sinigang na Baboy sa Miso', 'soup', ['pork', 'tamarind', 'miso', 'tomato'], 'boil and simmer', 'Sour pork soup deepened with savory miso.', ['water spinach', 'radish', 'long beans'], [substitute('pork', 'fish', 'Fish makes a lighter miso sinigang.')]),
  dish('paksiw-na-bangus', 'Paksiw na Bangus', 'braised', ['milkfish', 'vinegar', 'garlic', 'ginger'], 'simmer', 'Milkfish gently simmered in vinegar with aromatics.', ['eggplant', 'bitter melon', 'green chili'], [substitute('milkfish', 'tilapia', 'Tilapia is a practical fish alternative.')]),
  dish('inihaw-na-bangus', 'Inihaw na Bangus', 'grilled', ['milkfish', 'tomato', 'onion', 'garlic'], 'stuff and grill', 'Grilled milkfish stuffed with tomato, onion, and garlic.', ['calamansi', 'soy sauce', 'ginger'], [substitute('milkfish', 'tilapia', 'Tilapia can be grilled with the same stuffing.')]),
  dish('inihaw-na-tilapia', 'Inihaw na Tilapia', 'grilled', ['tilapia', 'garlic', 'calamansi', 'soy sauce'], 'marinate and grill', 'Grilled tilapia with a savory citrus marinade.', ['onion', 'tomato', 'ginger'], [substitute('tilapia', 'milkfish', 'Milkfish is a traditional grilled fish option.')]),
  dish('inihaw-na-pusit', 'Inihaw na Pusit', 'grilled', ['squid', 'soy sauce', 'calamansi', 'garlic'], 'marinate and grill', 'Grilled squid with a bright soy-calamansi marinade.', ['onion', 'chili', 'oil'], []),
  dish('tinolang-tahong', 'Tinolang Tahong', 'soup', ['mussels', 'ginger', 'garlic', 'water spinach'], 'boil and simmer', 'Mussels in a light ginger broth with leafy greens.', ['green papaya', 'chili leaves', 'onion'], []),
  dish('ginataang-tahong', 'Ginataang Tahong', 'stew', ['mussels', 'coconut milk', 'garlic', 'chili'], 'simmer', 'Mussels simmered in spicy coconut milk.', ['ginger', 'onion', 'squash'], []),
  dish('adobong-tahong', 'Adobong Tahong', 'simmered', ['mussels', 'garlic', 'soy sauce', 'vinegar'], 'simmer', 'Mussels cooked in a quick soy-vinegar adobo sauce.', ['chili', 'onion', 'ginger'], []),
  dish('sinuglaw', 'Sinuglaw', 'seafood', ['fish', 'pork belly', 'vinegar', 'calamansi'], 'grill and toss', 'Grilled pork and citrus-cured fish combined in a Filipino seafood dish.', ['onion', 'chili', 'ginger'], []),
  dish('tinolang-isda', 'Tinolang Isda', 'soup', ['fish', 'ginger', 'water spinach', 'onion'], 'boil and simmer', 'Light fish soup with ginger and leafy greens.', ['green papaya', 'chili leaves', 'tomato'], [substitute('fish', 'milkfish', 'Milkfish is a traditional soup fish.')]),
  dish('fish-kilawin', 'Kilawing Isda', 'seafood', ['fish', 'vinegar', 'calamansi', 'onion'], 'cure and toss', 'Fresh fish cured in vinegar and citrus with aromatics.', ['chili', 'ginger', 'coconut milk'], []),
  dish('dinengdeng', 'Dinengdeng', 'vegetable', ['bitter melon', 'eggplant', 'tomato', 'fish sauce'], 'boil and simmer', 'Ilocano vegetable soup flavored with grilled fish or fish sauce.', ['okra', 'long beans', 'squash'], [substitute('bitter melon', 'chayote', 'Chayote gives a milder vegetable soup.')]),
  dish('bulanglang', 'Bulanglang', 'vegetable', ['squash', 'tomato', 'eggplant', 'water spinach'], 'boil', 'Light boiled vegetable soup with fresh Filipino produce.', ['okra', 'long beans', 'corn'], [substitute('squash', 'chayote', 'Chayote is a practical soup vegetable.')]),
  dish('laswa', 'Laswa', 'vegetable', ['squash', 'okra', 'eggplant', 'water spinach'], 'boil', 'Simple Visayan mixed vegetable soup.', ['shrimp', 'tomato', 'long beans'], [substitute('squash', 'chayote', 'Chayote works well in vegetable soup.')]),
  dish('inabraw', 'Inabraw', 'vegetable', ['bitter melon', 'water spinach', 'eggplant', 'fish sauce'], 'boil and simmer', 'Ilocano vegetable dish with a light savory broth.', ['squash', 'okra', 'smoked fish'], [substitute('bitter melon', 'chayote', 'Chayote creates a milder version.')]),
  dish('ginisang-upo', 'Ginisang Upo', 'vegetable', ['bottle gourd', 'garlic', 'onion', 'tomato'], 'sauté', 'Sautéed bottle gourd with Filipino aromatics.', ['egg', 'shrimp', 'ground pork'], [substitute('bottle gourd', 'chayote', 'Chayote has a similar crisp texture.')]),
  dish('ginisang-patola', 'Ginisang Patola', 'vegetable', ['sponge gourd', 'garlic', 'onion', 'tomato'], 'sauté', 'Sautéed sponge gourd with tomato and aromatics.', ['egg', 'shrimp', 'ground pork'], [substitute('sponge gourd', 'bottle gourd', 'Bottle gourd is a practical substitute.')]),
  dish('ginisang-repolyo', 'Ginisang Repolyo', 'vegetable', ['cabbage', 'garlic', 'onion', 'tomato'], 'sauté', 'Sautéed cabbage with simple Filipino seasonings.', ['egg', 'shrimp', 'ground pork'], [substitute('cabbage', 'bok choy', 'Bok choy cooks quickly in the same style.')]),
  dish('ginisang-togue', 'Ginisang Togue', 'vegetable', ['bean sprouts', 'carrot', 'garlic', 'onion'], 'sauté', 'Crisp bean sprouts sautéed with vegetables and aromatics.', ['tofu', 'egg', 'green beans'], [substitute('bean sprouts', 'cabbage', 'Cabbage gives a similar vegetable base.')]),
  dish('ginataang-langka', 'Ginataang Langka', 'vegetable', ['young jackfruit', 'coconut milk', 'garlic', 'shrimp paste'], 'simmer', 'Young jackfruit simmered in savory coconut milk.', ['chili', 'pork', 'onion'], [substitute('young jackfruit', 'squash', 'Squash makes a different but creamy vegetable dish.')]),
  dish('ginataang-puso-ng-saging', 'Ginataang Puso ng Saging', 'vegetable', ['banana blossom', 'coconut milk', 'garlic', 'onion'], 'simmer', 'Banana blossom cooked in creamy coconut milk.', ['shrimp', 'chili', 'ginger'], [substitute('banana blossom', 'young jackfruit', 'Young jackfruit has a similar hearty texture.')]),
  dish('adobong-sitaw', 'Adobong Sitaw', 'vegetable', ['long beans', 'garlic', 'soy sauce', 'vinegar'], 'sauté and simmer', 'Long beans cooked in a quick adobo sauce.', ['pork', 'chili', 'onion'], [substitute('long beans', 'water spinach', 'Water spinach creates another vegetable adobo.')]),
  dish('adobong-talong', 'Adobong Talong', 'vegetable', ['eggplant', 'garlic', 'soy sauce', 'vinegar'], 'sauté and simmer', 'Eggplant cooked in a savory soy-vinegar adobo sauce.', ['pork', 'chili', 'onion'], [substitute('eggplant', 'bitter melon', 'Bitter melon makes a more savory vegetable adobo.')]),
  dish('pancit-malabon', 'Pancit Malabon', 'noodle', ['thick rice noodles', 'shrimp', 'shrimp paste', 'egg'], 'boil and assemble', 'Thick rice noodles with a rich seafood sauce and Filipino toppings.', ['smoked fish', 'pork cracklings', 'green onion'], [substitute('thick rice noodles', 'rice noodles', 'Rice noodles make a lighter noodle dish.')]),
  dish('pancit-luglug', 'Pancit Luglug', 'noodle', ['thick rice noodles', 'shrimp', 'shrimp paste', 'egg'], 'boil and assemble', 'Blanched rice noodles topped with savory seafood sauce.', ['pork cracklings', 'green onion', 'calamansi'], [substitute('thick rice noodles', 'rice noodles', 'Rice noodles are a practical alternative.')]),
  dish('pancit-habhab', 'Pancit Habhab', 'noodle', ['flour noodles', 'pork', 'cabbage', 'carrot'], 'stir-fry', 'Quezon-style stir-fried noodles with pork and vegetables.', ['soy sauce', 'green beans', 'shrimp'], [substitute('pork', 'chicken', 'Chicken creates a lighter noodle dish.')]),
  dish('sotanghon-guisado', 'Sotanghon Guisado', 'noodle', ['glass noodles', 'chicken', 'cabbage', 'carrot'], 'stir-fry', 'Stir-fried glass noodles with chicken and vegetables.', ['shrimp', 'soy sauce', 'green beans'], [substitute('chicken', 'pork', 'Pork gives a richer noodle dish.')]),
  dish('misua-patola', 'Misua with Patola', 'noodle soup', ['misua noodles', 'sponge gourd', 'garlic', 'onion'], 'boil and simmer', 'Light misua noodle soup with tender sponge gourd.', ['egg', 'shrimp', 'ground pork'], [substitute('sponge gourd', 'bottle gourd', 'Bottle gourd works in the same light soup.')]),
  dish('batchoy-tagalog', 'Batchoy Tagalog', 'soup', ['pork', 'ginger', 'garlic', 'misua noodles'], 'boil and simmer', 'Clear Tagalog pork soup with misua and ginger.', ['pork liver', 'green onion', 'chili leaves'], [substitute('pork', 'chicken', 'Chicken makes a lighter clear soup.')]),
  dish('pancit-chami', 'Pancit Chami', 'noodle', ['egg noodles', 'pork', 'cabbage', 'soy sauce'], 'stir-fry', 'Lucena-style saucy stir-fried egg noodles.', ['shrimp', 'carrot', 'green beans'], [substitute('pork', 'chicken', 'Chicken works well in the same noodle dish.')]),
  dish('arroz-a-la-cubana', 'Arroz a la Cubana Filipino-Style', 'rice meal', ['rice', 'ground beef', 'egg', 'banana'], 'sauté and fry', 'Filipino rice meal with savory ground meat, fried egg, and banana.', ['tomato sauce', 'garlic', 'soy sauce'], [substitute('ground beef', 'ground pork', 'Ground pork makes a common Filipino variation.')]),
  dish('hotsilog', 'Hotsilog', 'breakfast', ['hotdog', 'egg', 'rice'], 'fry', 'Filipino hotdog breakfast served with egg and garlic rice.', ['tomato', 'ketchup', 'cucumber'], [substitute('hotdog', 'longganisa', 'Longganisa creates a more traditional sausage breakfast.')]),
  dish('chiksilog', 'Chiksilog', 'breakfast', ['chicken', 'egg', 'rice'], 'fry', 'Chicken breakfast plate served with egg and garlic rice.', ['tomato', 'gravy', 'garlic'], [substitute('chicken', 'pork', 'Pork creates another familiar silog plate.')]),
  dish('spamsilog', 'Spamsilog', 'breakfast', ['luncheon meat', 'egg', 'rice'], 'fry', 'Crisp luncheon meat served with fried egg and garlic rice.', ['tomato', 'cucumber', 'garlic'], [substitute('luncheon meat', 'corned beef', 'Corned beef makes another quick breakfast plate.')]),
  dish('chopsuey', 'Chopsuey Filipino-Style', 'vegetable', ['cabbage', 'carrot', 'green beans', 'chicken'], 'sauté', 'Mixed vegetables sautéed with chicken in a light savory sauce.', ['shrimp', 'quail egg', 'bell pepper'], [substitute('chicken', 'tofu', 'Tofu creates a vegetarian version.')]),
  dish('lumpiang-sariwa', 'Lumpiang Sariwa', 'vegetable', ['lumpia wrapper', 'cabbage', 'carrot', 'green beans'], 'sauté and assemble', 'Fresh vegetable lumpia with a soft wrapper and savory filling.', ['tofu', 'shrimp', 'garlic'], [substitute('lumpia wrapper', 'lettuce', 'Lettuce makes a lighter fresh wrap.')]),
  dish('ginisang-corned-beef', 'Ginisang Corned Beef', 'quick meal', ['corned beef', 'potato', 'onion', 'garlic'], 'sauté', 'Quick sautéed corned beef with potatoes and aromatics.', ['egg', 'tomato', 'cabbage'], [substitute('corned beef', 'sardines', 'Sardines make a quick pantry sauté.')]),
  dish('tortang-sardinas', 'Tortang Sardinas', 'egg', ['sardines', 'egg', 'onion', 'garlic'], 'sauté and pan-fry', 'Canned sardines folded into a savory Filipino omelet.', ['tomato', 'potato', 'green onion'], [substitute('sardines', 'tuna', 'Canned tuna makes a milder omelet.')]),
  dish('beef-salpicao', 'Beef Salpicao Filipino-Style', 'sautéed', ['beef', 'garlic', 'butter', 'soy sauce'], 'sauté', 'Tender beef cubes sautéed with garlic, butter, and soy sauce.', ['oyster sauce', 'black pepper', 'parsley'], [substitute('beef', 'chicken', 'Chicken makes a lighter garlic-butter sauté.')]),
  dish('chicken-nilaga', 'Nilagang Manok', 'soup', ['chicken', 'cabbage', 'potato', 'onion'], 'boil and simmer', 'Clear chicken soup with potatoes and vegetables.', ['corn', 'green beans', 'black pepper'], [substitute('chicken', 'pork', 'Pork creates a richer clear soup.')]),
  dish('pork-curry', 'Filipino Pork Curry', 'stew', ['pork', 'coconut milk', 'potato', 'carrot'], 'sauté and simmer', 'Tender pork simmered in a mild Filipino coconut curry.', ['curry powder', 'bell pepper', 'onion'], [substitute('pork', 'chicken', 'Chicken creates a lighter curry.')]),
  dish('ginisang-talong', 'Ginisang Talong', 'vegetable', ['eggplant', 'garlic', 'onion', 'tomato'], 'sauté', 'Sautéed eggplant with tomato and Filipino aromatics.', ['egg', 'ground pork', 'shrimp'], [substitute('eggplant', 'bitter melon', 'Bitter melon creates another savory vegetable sauté.')]),
]

const mealTypeByCategory: Record<string, CatalogMealType> = {
  breakfast: 'breakfast',
  'rice meal': 'rice-meal',
  'sweet rice': 'rice-meal',
  'rice soup': 'soup',
  noodle: 'noodle-dish',
  'noodle soup': 'soup',
  vegetable: 'vegetable-dish',
  soup: 'soup',
  stew: 'stew',
}

const regionalDishIds: Record<string, CatalogRegion> = {
  'chicken-inasal': 'Visayas',
  'chicken-binakol': 'Visayas',
  'halang-halang-na-manok': 'Visayas',
  laswa: 'Visayas',
  sinuglaw: 'Visayas',
  'pancit-habhab': 'Luzon',
  'pancit-bato': 'Luzon',
  'pancit-chami': 'Luzon',
  dinakdakan: 'Luzon',
  pinapaitan: 'Luzon',
  dinengdeng: 'Luzon',
  inabraw: 'Luzon',
  kansi: 'Visayas',
  'beef-pares': 'Luzon',
  'batchoy-tagalog': 'Luzon',
}

export const filipinoRecipeCatalog: FilipinoRecipeCatalogEntry[] = rawFilipinoRecipeCatalog.map((entry) => ({
  ...entry,
  mealType: mealTypeByCategory[entry.category] ?? (entry.category === 'quick meal' || entry.category === 'fried' || entry.category === 'grilled' || entry.category === 'braised' || entry.category === 'simmered' || entry.category === 'roasted' || entry.category === 'steamed' || entry.category === 'stuffed' || entry.category === 'egg' || entry.category === 'sautÃ©ed' || entry.category === 'pasta' || entry.category === 'pie' || entry.category === 'seafood' || entry.category === 'salad' || entry.category === 'appetizer' ? 'main-dish' : 'main-dish'),
  region: regionalDishIds[entry.id] ?? 'National',
  verificationStatus: 'reviewed',
  essentialIngredients: entry.requiredIngredients.slice(0, Math.min(2, entry.requiredIngredients.length)),
}))

export function validateFilipinoRecipeCatalog(entries: FilipinoRecipeCatalogEntry[] = filipinoRecipeCatalog) {
  if (entries.length !== 150) throw new Error(`Expected 150 catalog entries, received ${entries.length}.`)

  const ids = new Set<string>()
  const names = new Set<string>()
  const ingredients = new Set(entries.flatMap((entry) => [...entry.requiredIngredients, ...entry.optionalIngredients]))

  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id)) throw new Error(`Catalog entry IDs must be unique: ${entry.id}`)
    if (!entry.name || names.has(entry.name.toLowerCase())) throw new Error(`Catalog dish names must be unique: ${entry.name}`)
    if (entry.requiredIngredients.length === 0) throw new Error(`Catalog entry has no required ingredients: ${entry.id}`)
    if (!entry.mealType || !entry.region || !entry.verificationStatus) throw new Error(`Catalog entry metadata is incomplete: ${entry.id}`)
    if (!['classic', 'home-style'].includes(entry.authenticity)) throw new Error(`Catalog entries must be classic or home-style: ${entry.id}`)
    if (['sauce', 'condiment', 'drink', 'dessert', 'snack', 'pickle'].some((term) => entry.category.toLowerCase().includes(term))) {
      throw new Error(`Catalog entry is not a prepared meal: ${entry.id}`)
    }
    const allIngredients = [...entry.requiredIngredients, ...entry.optionalIngredients]
    if (allIngredients.some((ingredient) => !ingredient.trim())) throw new Error(`Catalog entry has an empty ingredient: ${entry.id}`)
    if (entry.essentialIngredients.length === 0 || entry.essentialIngredients.some((ingredient) => !entry.requiredIngredients.includes(ingredient))) throw new Error(`Catalog entry has invalid essential ingredients: ${entry.id}`)
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
