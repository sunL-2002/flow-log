import { clsx } from 'clsx'
import { NavLink } from 'react-router-dom'
import { uiStore } from '../../stores/uiStore'
import { ACTIVITY_TYPES } from '../../types/activity'

export default function Header() {
  const { currentActivity, currentConfidence, isTracking, setTracking } = uiStore()
  const activityInfo = ACTIVITY_TYPES[currentActivity as keyof typeof ACTIVITY_TYPES] || ACTIVITY_TYPES.unknown
  
  return (
    <header className="flex items-center justify-between px-lg py-md border-b border-border bg-surface">
      <div className="flex items-center gap-md">
        <h1 className="text-h1 font-bold text-primary-500">FlowLog</h1>
        
        <div className="flex items-center gap-sm px-3 py-1 rounded-full bg-surface border border-border">
          <span 
            className={clsx(
              'w-2 h-2 rounded-full',
              isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            )}
          />
          <span className="text-small text-text-secondary">
            {isTracking ? '记录中' : '已暂停'}
          </span>
        </div>
        
        {isTracking && (
          <div className="flex items-center gap-sm">
            <span>{activityInfo.icon}</span>
            <span className="text-body">{activityInfo.name}</span>
            {currentConfidence < 80 && (
              <span className="text-tiny text-text-secondary">({currentConfidence}%)</span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-sm">
        <button
          onClick={() => setTracking(!isTracking)}
          className={clsx(
            'px-3 py-1 rounded-md text-small transition-colors',
            isTracking 
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          )}
        >
          {isTracking ? '⏸️ 暂停' : '▶️ 恢复'}
        </button>
        
        <NavLink
          to="/settings"
          className={({ isActive }) => clsx(
            'p-2 rounded-md transition-colors',
            isActive ? 'bg-primary-100 text-primary-500' : 'hover:bg-surface'
          )}
        >
          ⚙️
        </NavLink>
      </div>
    </header>
  )
}
