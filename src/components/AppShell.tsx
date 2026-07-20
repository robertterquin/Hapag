import type { ReactNode } from 'react'
import type { AppRoute } from '../app/router.ts'

interface AppShellProps {
  routeName: AppRoute['name']
  onNavigate: (path: string) => void
  children: ReactNode
}

const navigation = [
  { label: 'Home', path: '/', route: 'home' as const, icon: '⌂' },
  { label: 'Ulam AI', path: '/ulam', route: 'ulam' as const, icon: '✦' },
  { label: 'Saved', path: '/saved', route: 'saved' as const, icon: '♡' },
  { label: 'Pantry', path: '/pantry', route: 'pantry' as const, icon: '▦' },
]

export function AppShell({ routeName, onNavigate, children }: AppShellProps) {
  const isActive = (route: AppRoute['name']) => routeName === route || (route === 'ulam' && routeName === 'results')

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Main navigation">
        <button className="brand-lockup" type="button" onClick={() => onNavigate('/')}>
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>
            <strong>Hapag</strong>
            <small>May sahog ka? Luto tayo.</small>
          </span>
        </button>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <button
              className={`nav-item ${isActive(item.route) ? 'nav-item-active' : ''}`}
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              aria-current={isActive(item.route) ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="profile-link" type="button" onClick={() => onNavigate('/profile')}>
            <span className="avatar" aria-hidden="true">U</span>
            <span>
              <strong>Profile</strong>
              <small>Preferences</small>
            </span>
          </button>
        </div>
      </aside>

      <div className="app-content-wrap">
        <header className="mobile-header">
          <button className="mobile-brand" type="button" onClick={() => onNavigate('/')}>
            <span className="brand-mark" aria-hidden="true">H</span>
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
              <span aria-hidden="true">{item.icon}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
