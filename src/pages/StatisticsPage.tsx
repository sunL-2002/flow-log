import { useEffect } from 'react'
import { activityStore } from '../stores/activityStore'
import WeeklyChart from '../components/statistics/WeeklyChart'
import ActivityBreakdown from '../components/statistics/ActivityBreakdown'

export default function StatisticsPage() {
  const { loadWeeklyStats, weeklyStats } = activityStore()
  
  useEffect(() => {
    const today = new Date()
    const endOfWeek = today.toISOString().split('T')[0]
    const startOfWeek = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    loadWeeklyStats(startOfWeek, endOfWeek)
  }, [loadWeeklyStats])
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-h1 font-bold mb-lg">统计</h2>
      
      <div className="flex-1 grid grid-cols-2 gap-lg overflow-auto">
        <div className="bg-surface rounded-lg p-lg">
          <h3 className="text-h2 font-semibold mb-md">本周趋势</h3>
          <WeeklyChart />
        </div>
        
        <div className="bg-surface rounded-lg p-lg">
          <h3 className="text-h2 font-semibold mb-md">时间分配</h3>
          <ActivityBreakdown />
        </div>
        
        <div className="col-span-2 bg-surface rounded-lg p-lg">
          <h3 className="text-h2 font-semibold mb-md">本周详情</h3>
          {weeklyStats && (
            <div className="grid grid-cols-3 gap-md">
              <div className="text-center p-md">
                <div className="text-display font-bold text-primary-500">
                  {Math.round((weeklyStats.total_seconds / 3600) * 10) / 10}h
                </div>
                <div className="text-small text-text-secondary">总专注时长</div>
              </div>
              <div className="text-center p-md">
                <div className="text-display font-bold text-primary-500">
                  {weeklyStats.activity_count}
                </div>
                <div className="text-small text-text-secondary">活动记录数</div>
              </div>
              <div className="text-center p-md">
                <div className="text-display font-bold text-primary-500">
                  {Object.keys(weeklyStats.type_breakdown).length}
                </div>
                <div className="text-small text-text-secondary">活动类型</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
