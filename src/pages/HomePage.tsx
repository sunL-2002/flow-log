import { activityStore } from '../stores/activityStore'
import Timeline from '../components/timeline/Timeline'
import DateNavigator from '../components/timeline/DateNavigator'
import DailySummary from '../components/statistics/DailySummary'

export default function HomePage() {
  const { isLoading } = activityStore()
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-lg">
        <DateNavigator />
      </div>
      
      <div className="flex-1 flex gap-lg overflow-hidden">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-text-secondary">加载中...</div>
            </div>
          ) : (
            <Timeline />
          )}
        </div>
        
        <div className="w-64 flex-shrink-0">
          <DailySummary />
        </div>
      </div>
    </div>
  )
}
