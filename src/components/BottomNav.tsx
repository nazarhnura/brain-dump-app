import type { Screen } from '../types'

interface BottomNavProps {
  active: Screen
  onChange: (screen: Screen) => void
}

const TABS: { id: Screen; label: string; icon: string }[] = [
  { id: 'capture', label: 'Capture', icon: '✎' },
  { id: 'inbox', label: 'Inbox', icon: '▤' },
  { id: 'today', label: 'Today', icon: '✓' },
  { id: 'game', label: 'Game', icon: '⚽' },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bottom-nav__tab ${active === tab.id ? 'bottom-nav__tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <span className="bottom-nav__icon" aria-hidden="true">{tab.icon}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
