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

  // 1. Adobo Profiles (Chicken/Pork + Soy Sauce / Vinegar / Garlic)
  if (hasAny('chicken', 'pork', 'pork belly', 'pork shoulder', 'manok', 'baboy') && hasAny('soy sauce', 'vinegar', 'toyo', 'suka', 'garlic', 'bawang')) {
    banters.push({
      tag: 'Adobo Vibe',
      headline: 'Amoy Adobo na dito ah!',
      subline: 'Sinasangag na ni Chef Kalabaw ang bawang at toyo para sa malinamnam na glaze.',
      tip: 'Tip ni Chef: Huwag munang haluin ang suka kapag kakalagay pa lang para hindi mag-asim nang hilaw.',
    })
    banters.push({
      tag: 'Tantiyang Pinoy',
      headline: 'Tinatantya ang tamang timpla ng toyo at suka…',
      subline: 'Sinusuri kung bagay sa may sabaw o tuyo-style na adobo.',
      tip: 'Mas masarap ang adobo kapag napatagal nang bahagya sa mahinang apoy!',
    })
  }

  // 2. Fish & Tomato / Sarciado / Escabeche / Paksiw Profiles (checked before general tomato)
  if (hasAny('fish', 'tilapia', 'milkfish', 'bangus', 'isda') && (hasAny('tomato', 'kamatis', 'onion', 'sibuyas', 'egg', 'itlog') || has('vinegar') || has('suka'))) {
    banters.push({
      tag: 'Sariwang Huli',
      headline: 'Sariwang isda at kamatis? Sarciado o Paksiw kaya?',
      subline: 'Ginagawan natin ng paraan para manatiling makatas at malinamnam ang isda.',
      tip: 'Tip ni Chef: Iprito muna nang bahagya ang isda bago isarsa para hindi magkadurog-durog.',
    })
    banters.push({
      tag: 'Linamnam ng Dagat',
      headline: 'Ginigisa na ang mga aromatics para sa isda…',
      subline: 'Inaayos ang sarsa para kumapit nang husto sa laman.',
    })
  }

  // 3. Sour Soup / Sinigang Profiles
  if (hasAny('tamarind', 'sampalok', 'sinigang mix', 'calamansi', 'kamias') || (hasAny('shrimp', 'pork', 'milkfish', 'bangus', 'tilapia') && hasAny('kangkong', 'radish', 'labanos', 'gabi', 'taro'))) {
    banters.push({
      tag: 'Asim-Kilig Sabaw',
      headline: 'Maasim-asim na sabaw ang paborito ng pamilya!',
      subline: 'Kumukulo na ang palayok! Binabalanse ang asim at linamnam para swak sa mainit na kanin.',
      tip: 'Tip ni Chef: Ilagay ang dahon tulad ng kangkong sa huling minuto bago patayin ang apoy para manatiling sariwa.',
    })
    banters.push({
      tag: 'Kusina Sinsay',
      headline: 'Pampagising na asim ang inihahanda…',
      subline: 'Tinitingnan ang pinakamasarap na kombinasyon ng gulay at protina para sa sabaw.',
    })
  }

  // 4. Coconut Milk / Ginataan / Bicol Express Profiles
  if (hasAny('coconut milk', 'gata', 'niyog', 'coconut cream') || (hasAny('chili', 'sili', 'siling haba', 'siling labuyo') && hasAny('pork', 'squash', 'kalabasa', 'sitaw', 'shrimp'))) {
    banters.push({
      tag: 'Ginataang Linamnam',
      headline: 'May creamy at malinamnam tayong niluluto!',
      subline: 'Dahan-dahang pinapakulo ang gata kasama ng mga pampalasa para lumabas ang mantika nito.',
      tip: 'Tip ni Chef: Katamtamang init lang para hindi magbuo-buo o mag-langis ang gata nang maaga.',
    })
    banters.push({
      tag: 'Bicolano Heat',
      headline: 'Tinitimplahan ang creamy sauce na may banayad na anghang…',
      subline: 'Perpektong kapares sa bagong saing na kanin!',
    })
  }

  // 5. Canned Goods Upgrades (Sardines, Corned Beef, Tuna)
  if (hasAny('sardines', 'sardinas', 'corned beef', 'tuna', 'canned meat', 'luncheon meat', 'spam')) {
    banters.push({
      tag: 'Kusina Diskarte',
      headline: 'Pang-budget meal na gagawing pang-espesyal!',
      subline: 'Gigisahin ni Chef Kalabaw sa maraming bawang, sibuyas, at gulay para mas masustansya.',
      tip: 'Tip ni Chef: Lagyan ng kaunting piga ng kalamansi o siling labuyo ang delata para lumabas ang tunay na linamnam.',
    })
    banters.push({
      tag: 'Mabilisang Lutuin',
      headline: 'Level-up na lutong-bahay mula sa delata…',
      subline: 'Sinusukat ang tamang halo para mabilis pero napakasarap!',
    })
  }

  // 6. Tomato Braises / Stews (Afritada, Menudo, Mechado, Caldereta)
  if (hasAny('tomato sauce', 'tomato paste', 'liver spread', 'cheese') || (hasAny('pork', 'beef', 'chicken') && hasAny('potato', 'patatas', 'carrot', 'carrots', 'bell pepper', 'peas'))) {
    banters.push({
      tag: 'Pang-Piyesta Stew',
      headline: 'May masaganang sarsa tayong inihahanda!',
      subline: 'Pinagpapasensyahan ang dahan-dahang paglambot ng karne kasama ang patatas at karot.',
      tip: 'Tip ni Chef: Ang patatas ang natural na nagpapalapot sa sarsa habang kumukulo.',
    })
    banters.push({
      tag: 'Sarsang Masagana',
      headline: 'Pinagpapakulo ang mayaman at malinamnam na sarsa…',
      subline: 'Sinusuri kung Menudo, Afritada, o Mechado ang pinakabagay sa sangkap mo.',
    })
  }

  // 7. Pancit & Noodle Profiles
  if (hasAny('bihon', 'canton noodles', 'flour noodles', 'egg noodles', 'miki', 'sotanghon', 'glass noodles', 'macaroni')) {
    banters.push({
      tag: 'Pansit Paborito',
      headline: 'May pansit tayong bubuuin! Hinihiwa na ang mga gulay…',
      subline: 'Hahayaan nating sipsipin ng noodles ang lahat ng linamnam ng ginisang sangkap.',
      tip: 'Tip ni Chef: Huwag sosobrahan ang sabaw para hindi maging matubig ang pansit.',
    })
  }

  // 8. Ginger & Comfort Broths (Tinola, Pesang Isda, Arroz Caldo)
  if (hasAny('ginger', 'luya', 'chayote', 'sayote', 'green papaya', 'papaya', 'malunggay', 'rice', 'glutinous rice')) {
    banters.push({
      tag: 'Mainit na Sabaw',
      headline: 'Amoy luya at bawang! Mainit at nakakapreskong sabaw ang parating…',
      subline: 'Pampawis at pampaginhawa sa pakiramdam ang niluluto ni Chef Kalabaw.',
      tip: 'Tip ni Chef: Bahagyang dikdikin ang luya bago igisa para sumabog ang bango nito sa sabaw.',
    })
  }

  // 9. Egg / Torta Profiles
  if (has('egg') || has('itlog')) {
    if (hasAny('eggplant', 'talong', 'ground pork', 'giniling', 'potato', 'patatas')) {
      banters.push({
        tag: 'Tortang Klasiko',
        headline: 'Inihaw na talong at binating itlog! Klasikong sarap.',
        subline: 'Ipiprito nang golden brown para may lutong sa labas at lambot sa loob.',
        tip: 'Tip ni Chef: Tusukin ang talong bago ihawin para madaling matanggal ang sunog na balat.',
      })
    }
  }

  // 10. Tofu / Healthy Veggies
  if (hasAny('tofu', 'tokwa', 'kangkong', 'sitaw', 'pechay', 'bok choy', 'repolyo', 'cabbage', 'okra', 'ampalaya')) {
    banters.push({
      tag: 'Sariwang Gulay',
      headline: 'Masustansya at presko! Niluluto ang mga sariwang gulay.',
      subline: 'Mabilisang gisa lang sa katamtamang init para manatiling malutong at makulay.',
      tip: 'Tip ni Chef: Huwag takpan nang matagal ang berdeng gulay para manatiling sariwa ang kulay.',
    })
  }

  // Fallback general messages if no specific banter triggered
  if (banters.length === 0) {
    const firstItemName = ingredients[0]?.name ?? 'mga sangkap'
    banters.push({
      tag: 'Kusina ni Chef',
      headline: `Tinitimplahan na ang palayok gamit ang ${firstItemName}!`,
      subline: 'Sinisilip ni Chef Kalabaw ang pinakamasarap at praktikal na paraan ng pagluto.',
      tip: 'Tip ni Chef: Ang sikreto ng masarap na ulam ay nasa tamang paggisa ng bawang at sibuyas.',
    })
    banters.push({
      tag: 'Paghahanda ng Ideya',
      headline: 'Naghahanap ng 3 kakaibang paraan ng pagluto…',
      subline: 'Iniaangkop sa budget, serving, at pamilyang Pinoy ang bawat putahe.',
    })
  }

  // Always append a closing reassuring banter
  banters.push({
    tag: 'Sandali na lang',
    headline: 'Inihahanda na ang 3 resipe para sa hapag mo!',
    subline: 'Tinitiyak na kumpleto ang sukat, paraan, at mga alternatibong sangkap.',
  })

  return banters
}
