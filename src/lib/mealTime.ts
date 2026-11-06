// The meal Filipinos are thinking about at a given hour, for the Home page's time chip.
export function mealOfHour(hour: number) {
  if (hour >= 5 && hour < 10) return 'Almusal na'
  if (hour >= 10 && hour < 14) return 'Tanghalian na'
  if (hour >= 14 && hour < 17) return 'Merienda na'
  if (hour >= 17 && hour < 22) return 'Hapunan na'
  return 'Gabi na'
}

export function mealTimeLabel(date: Date) {
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return { time, meal: mealOfHour(date.getHours()) }
}
