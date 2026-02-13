import { activityStore } from '../../stores/activityStore'
import { ACTIVITY_TYPES } from '../../types/activity'

export default function DailySummary() {
  const { dailyStats } = activityStore()
  
  if (!dailyStats) {
    return (
      <div className="bg-surface rounded-lg p-lg">
        <h3 className="text-h2 font-semibold mb-md">🏆 今日统计</h3>
        <div className="text-text-secondary">暂无数据</div>
      </div>
    )
  }
  
  const totalHours = (dailyStats.total_seconds / 3600).toFixed(1)
  
  const sortedBreakdown = Object.entries(dailyStats.breakdown)
    .sort((a, b) => b[1] - a[1])
  
  return (
    <div className="bg-surface rounded-lg p-lg">
      <h3 className="text-h2 font-semibold mb-md">🏆 今日统计</h3>
      
      <div className="text-center mb-lg">
        <div className="text-display font-bold text-primary-500">
          {totalHours}h
        </div>
        <div className="text-small text-text-secondary">总专注时长</div>
      </div>
      
      <div className="space-y-sm">
        {sortedBreakdown.map(([type, seconds]) => {
          const info = ACTIVITY_TYPES[type as keyof typeof ACTIVITY_TYPES] || ACTIVITY_TYPES.unknown
          const hours = (seconds / 3600).toFixed(1)
          const percentage = dailyStats.total_seconds > 0 
            ? Math.round((seconds / dailyStats.total_seconds) * 100) 
            : 0
          
          return (
            <div key={type} className="space-y-xs">
              <div className="flex items-center justify-between text-small">
                <span className="flex items-center gap-1">
                  <span>{info.icon}</span>
                  <span>{info.name}</span>
                </span>
                <span className="text-text-secondary">
                  {hours}h ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: info.color 
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-lg pt-md border-t border-border">
        <div className="text-small text-text-secondary">
          共 {dailyStats.activity_count} 条记录
        </div>
      </div>
    </div>
  )
}
