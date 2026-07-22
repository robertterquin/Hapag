import type { ReactNode } from 'react'
import { Icon } from '@iconify/react'
import type { AppRoute } from '../app/router.ts'
import { BrandMark } from './BrandMark.tsx'

interface AppShellProps {
  routeName: AppRoute['name']
  onNavigate: (path: string) => void
  children: ReactNode
}

const navigation = [
  { label: 'Home', path: '/', route: 'home' as const, icon: 'lucide:house' },
  { label: 'Ulam AI', path: '/ulam', route: 'ulam' as const, icon: 'lucide:sparkles' },
  { label: 'Saved', path: '/saved', route: 'saved' as const, icon: 'lucide:heart' },
  { label: 'My Ingredients', path: '/pantry', route: 'pantry' as const, icon: 'lucide:list-checks' },
]

export function AppShell({ routeName, onNavigate, children }: AppShellProps) {
  const isActive = (route: AppRoute['name']) => routeName === route || (route === 'ulam' && (routeName === 'results' || routeName === 'recipe-detail' || routeName === 'cooking'))

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <button className="brand-lockup" type="button" onClick={() => onNavigate('/')}>
          <BrandMark className="brand-mark" />
          <span>
            <strong>Hapag</strong>
            <small>May sahog ka? Luto tayo.</small>
          </span>
        </button>

        <nav className="topbar-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item ${isActive(item.route) ? 'nav-item-active' : ''}`}
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              aria-current={isActive(item.route) ? 'page' : undefined}
            >
              <Icon className="nav-icon" icon={item.icon} width={20} height={20} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        <button className="profile-link" type="button" onClick={() => onNavigate('/profile')}>
          <span className="avatar" aria-hidden="true">U</span>
          <span className="profile-copy">
            <strong>Profile</strong>
            <small>Preferences</small>
          </span>
        </button>
      </header>

      <div className="app-content-wrap">
        <header className="mobile-header">
          <button className="mobile-brand" type="button" onClick={() => onNavigate('/')}>
            <BrandMark className="brand-mark" size={36} />
            <strong>Hapag</strong>
          </button>
          <button className="icon-button" type="button" onClick={() => onNavigate('/profile')} aria-label="Open profile">
            U
          </button>
        </header>

        <main className="app-content">{children}</main>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <button
              className={`mobile-nav-item ${isActive(item.route) ? 'mobile-nav-item-active' : ''}`}
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              aria-current={isActive(item.route) ? 'page' : undefined}
            >
              <Icon icon={item.icon} width={20} height={20} aria-hidden="true" />
              <small>{item.label}</small>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
