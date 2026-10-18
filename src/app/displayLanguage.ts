import { createContext, useContext } from 'react'
import type { DisplayLanguage } from '../lib/ingredientLabels.ts'

export const DisplayLanguageContext = createContext<DisplayLanguage>('Taglish')

export function useDisplayLanguage() {
  return useContext(DisplayLanguageContext)
}
