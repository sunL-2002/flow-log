import { clsx } from 'clsx'
import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: '今天', icon: '📅' },
  { path: '/statistics', label: '统计', icon: '📊' },
  { path: '/report', label: '周报', icon: '📝' },
]

export default function Navigation() {
  return (
    <nav className="w-48 border-r border-border bg-surface">
      <div className="p-md">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                isActive 
                  ? 'bg-primary-100 text-primary-500 font-medium' 
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
