import { activityStore } from '../../stores/activityStore'
import { ACTIVITY_TYPES } from '../../types/activity'

export default function ActivityBreakdown() {
  const { weeklyStats } = activityStore()
  
  if (!weeklyStats || !weeklyStats.type_breakdown) {
    return (
      <div className="h-48 flex items-center justify-center text-text-secondary">
        暂无数据
      </div>
    )
  }
  
  const total = weeklyStats.total_seconds || 1
  const sortedTypes = Object.entries(weeklyStats.type_breakdown)
    .sort((a, b) => b[1] - a[1])
  
  return (
    <div className="space-y-md">
      {sortedTypes.map(([type, seconds]) => {
        const info = ACTIVITY_TYPES[type as keyof typeof ACTIVITY_TYPES] || ACTIVITY_TYPES.unknown
        const hours = (seconds / 3600).toFixed(1)
        const percentage = Math.round((seconds / total) * 100)
        
        return (
          <div key={type} className="flex items-center gap-md">
            <div className="w-8 text-center">{info.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-xs">
                <span className="text-body">{info.name}</span>
                <span className="text-small text-text-secondary">{hours}h</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: info.color 
                  }}
                />
              </div>
            </div>
            <div className="w-12 text-right text-small text-text-secondary">
              {percentage}%
            </div>
          </div>
        )
      })}
    </div>
  )
}
