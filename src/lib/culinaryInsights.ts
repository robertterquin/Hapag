export function generateDishCulinaryInsight(dishTitle: string, availableIngredientNames: string[] = []): string {
  const lower = dishTitle.toLowerCase()
  const ingredientsStr = availableIngredientNames.join(', ')

  if (/afritada/i.test(lower)) {
    return 'Simmering the meat in savory tomato sauce creates a rich, hearty sauce that thickens naturally without requiring heavy seasoning.'
  }
  if (/sinigang/i.test(lower)) {
    return 'The savory protein yields a rich broth that balances beautifully with the sharp, mouth-watering sour tamarind soup profile.'
  }
  if (/adobo/i.test(lower)) {
    return 'Braising in soy sauce, vinegar, and garlic tenderizes the meat while reducing into a deeply savory, aromatic glaze.'
  }
  if (/tinola/i.test(lower)) {
    return 'Infusing fresh ginger into the broth highlights the natural sweetness of the meat for a light, comforting soup.'
  }
  if (/menudo|mechado|caldereta/i.test(lower)) {
    return 'The slow tomato braise allows the meat and root vegetables to meld together into a thick, deeply satisfying stew.'
  }
  if (/pochero/i.test(lower)) {
    return 'The combination of savory meat and sweet-tangy tomato broth gives this classic Spanish-Filipino stew its signature comforting depth.'
  }
  if (/sarciado|escabeche/i.test(lower)) {
    return 'Sautéing fresh tomatoes and eggs creates a luscious, savory sauce that clings perfectly to the protein.'
  }
  if (/paksiw/i.test(lower)) {
    return 'Simmering with vinegar and aromatics creates a bright, tangy broth that keeps the dish clean, light, and flavorful.'
  }
  if (/nilaga|bulalo/i.test(lower)) {
    return 'Gentle simmering coaxes out rich, pure broth while keeping the leafy greens and vegetables crisp-tender.'
  }
  if (/torta|omelet/i.test(lower)) {
    return 'The egg creates a golden, savory crust that locks in moisture and complements the tender filling perfectly.'
  }
  if (/ginisang|ginisa|guisado/i.test(lower)) {
    return 'A quick, high-heat sauté keeps the vegetables crisp and vibrant while garlic and onions build a fragrant base.'
  }
  if (/pancit|bihon|canton|miki|sotanghon/i.test(lower)) {
    return 'Tossing the noodles in seasoned broth lets them absorb the savory essence of the sautéed meat and vegetables.'
  }
  if (/bistek|steak/i.test(lower)) {
    return 'Marinating in citrus and soy sauce creates a tenderizing, tangy-savory reduction accented by sweet sliced onions.'
  }
  if (/kare-kare/i.test(lower)) {
    return 'A nutty, savory sauce coats the tender meat and greens for a comforting, authentic Filipino classic.'
  }
  if (/curry|kari/i.test(lower)) {
    return 'Simmering with coconut milk and aromatics creates a rich, creamy sauce that gently coats each ingredient.'
  }
  if (/monggo|munggo/i.test(lower)) {
    return 'Slow-simmered mung beans break down into a comforting, earthy stew enriched with savory aromatics.'
  }

  if (ingredientsStr) {
    return `Cooking ${ingredientsStr} with classic Filipino aromatics unlocks deep, natural flavors that come together effortlessly in this dish.`
  }
  return 'A classic home-style preparation where gentle simmering coaxes out rich, comforting flavors with minimal effort.'
}
