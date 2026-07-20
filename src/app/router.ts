import { useEffect, useState } from 'react'

export type AppRoute =
  | { name: 'home' }
  | { name: 'ulam' }
  | { name: 'results' }
  | { name: 'recipe-detail'; recipeId: string }
  | { name: 'cooking'; recipeId: string }
  | { name: 'saved' }
  | { name: 'pantry' }
  | { name: 'profile' }
  | { name: 'auth' }
  | { name: 'not-found' }

export function parseRoute(pathname: string): AppRoute {
  const cleanPath = pathname.replace(/\/+$/, '') || '/'

  if (cleanPath === '/') return { name: 'home' }
  if (cleanPath === '/ulam') return { name: 'ulam' }
  if (cleanPath === '/results') return { name: 'results' }
  if (cleanPath === '/saved') return { name: 'saved' }
  if (cleanPath === '/pantry') return { name: 'pantry' }
  if (cleanPath === '/profile') return { name: 'profile' }
  if (cleanPath === '/auth') return { name: 'auth' }

  const recipeMatch = cleanPath.match(/^\/recipes\/([^/]+)(\/cook)?$/)
  if (recipeMatch) {
    const recipeId = decodeURIComponent(recipeMatch[1])
    return recipeMatch[2]
      ? { name: 'cooking', recipeId }
      : { name: 'recipe-detail', recipeId }
  }

  return { name: 'not-found' }
}

export function useAppRouter() {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    if (path === window.location.pathname) return
    window.history.pushState({}, '', path)
    setRoute(parseRoute(path))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { route, navigate }
}
