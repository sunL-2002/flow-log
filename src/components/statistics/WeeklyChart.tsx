import { activityStore } from '../../stores/activityStore'

export default function WeeklyChart() {
  const { weeklyStats } = activityStore()
  
  if (!weeklyStats || !weeklyStats.daily_breakdown) {
    return (
      <div className="h-48 flex items-center justify-center text-text-secondary">
        暂无数据
      </div>
    )
  }
  
  const days = Object.keys(weeklyStats.daily_breakdown).sort()
  const values = days.map(d => weeklyStats.daily_breakdown[d] / 3600)
  const maxValue = Math.max(...values, 1)
  
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  
  return (
    <div className="h-48 flex items-end justify-around gap-sm">
      {days.map((day) => {
        const date = new Date(day)
        const hours = weeklyStats.daily_breakdown[day] / 3600
        const height = (hours / maxValue) * 100
        
        return (
          <div key={day} className="flex flex-col items-center gap-sm">
            <div 
              className="w-8 bg-primary-500 rounded-t transition-all duration-300"
              style={{ height: `${Math.max(height, 2)}%` }}
            />
            <div className="text-small text-text-secondary">
              {weekdays[date.getDay()]}
            </div>
            <div className="text-tiny text-text-secondary">
              {hours.toFixed(1)}h
            </div>
          </div>
        )
      })}
    </div>
  )
}
