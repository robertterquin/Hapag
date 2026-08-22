import type { ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'motion/react'
import type { AppRoute } from '../app/router.ts'
import { BrandMark } from './BrandMark.tsx'

interface AppShellProps {
  routeName: AppRoute['name']
  contentKey: string
  onNavigate: (path: string) => void
  fullName?: string
  children: ReactNode
}

const navigation = [
  { label: 'Home', path: '/', route: 'home' as const, icon: 'lucide:house' },
  { label: 'Ulam AI', path: '/ulam', route: 'ulam' as const, icon: 'lucide:sparkles' },
  { label: 'Saved', path: '/saved', route: 'saved' as const, icon: 'lucide:heart' },
]

export function AppShell({ routeName, contentKey, onNavigate, fullName, children }: AppShellProps) {
  const isActive = (route: AppRoute['name']) => routeName === route || (route === 'ulam' && (routeName === 'results' || routeName === 'recipe-detail' || routeName === 'cooking'))
  const profileInitial = (fullName?.[0] ?? 'U').toUpperCase()

  return (
    <div className={`app-shell app-shell-${routeName}`}>
      <div className="app-background" aria-hidden="true">
        <svg className="background-flow" viewBox="0 0 1280 900" preserveAspectRatio="none" fill="none">
          <path className="background-flow-line" d="M-40 180C170 55 270 310 470 205C655 108 725 35 900 145C1065 250 1090 420 1340 310" />
          <path className="background-flow-line background-flow-line-secondary" d="M-80 720C175 610 250 815 470 690C675 575 790 760 1000 650C1135 580 1220 630 1360 560" />
          <circle className="background-orb background-orb-green" cx="122" cy="170" r="11" />
          <circle className="background-orb background-orb-mango" cx="495" cy="196" r="8" />
          <circle className="background-orb background-orb-tomato" cx="910" cy="143" r="10" />
          <circle className="background-orb background-orb-green" cx="1110" cy="654" r="12" />
          <g className="background-doodle background-doodle-bowl">
            <ellipse cx="1125" cy="222" rx="50" ry="22" />
            <ellipse cx="1125" cy="222" rx="34" ry="13" />
            <path d="M1105 199C1095 185 1105 176 1105 165M1145 199C1135 185 1145 176 1145 165" />
          </g>
          <g className="background-doodle background-doodle-leaf">
            <path d="M180 680C203 643 238 637 261 658C237 684 207 694 180 680Z" />
            <path d="M185 678C211 674 231 664 254 652" />
          </g>
          <g className="background-doodle background-doodle-spark">
            <path d="M1010 745V790M988 768H1032M995 753L1025 783M1025 753L995 783" />
          </g>
          <g className="background-doodle background-doodle-garlic">
            <path d="M390 430C380 413 387 396 403 388C419 396 426 413 416 430C408 441 398 441 390 430Z" />
            <path d="M403 388C400 378 405 370 413 366M403 388C398 378 391 373 384 372" />
          </g>
          <g className="background-doodle background-doodle-chili">
            <path d="M930 500C968 483 1002 494 1016 520C990 535 959 532 930 500Z" />
            <path d="M930 500C955 510 982 515 1010 511M1012 493C1019 484 1028 483 1034 489" />
          </g>
        </svg>
      </div>

      <div className="app-topbar-wrapper">
        <header className="app-topbar">
          <button className="brand-lockup" type="button" onClick={() => onNavigate('/')}>
            <BrandMark className="brand-mark" size={30} />
            <strong className="brand-name">Hapag</strong>
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
                <Icon className="nav-icon" icon={item.icon} width={18} height={18} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <button className="profile-link" type="button" onClick={() => onNavigate('/profile')} aria-label="Profile and preferences">
            <span className="avatar" aria-hidden="true">{profileInitial}</span>
            <span className="profile-name">{fullName?.split(' ')[0] ?? 'Profile'}</span>
          </button>
        </header>
      </div>

      <div className="app-content-wrap">
        <header className="mobile-header">
          <button className="mobile-brand" type="button" onClick={() => onNavigate('/')}>
            <BrandMark className="brand-mark" size={36} />
            <strong>Hapag</strong>
          </button>
          <button className="mobile-profile-button" type="button" onClick={() => onNavigate('/profile')} aria-label="Open profile">
            <span className="avatar" aria-hidden="true">{profileInitial}</span>
          </button>
        </header>

        <main className="app-content">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="page-transition"
              key={contentKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

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
