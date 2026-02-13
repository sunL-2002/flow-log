import { activityStore } from '../../stores/activityStore'

export default function DateNavigator() {
  const { selectedDate, setSelectedDate } = activityStore()
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    
    if (isToday) {
      return `今天 ${date.getMonth() + 1}月${date.getDate()}日`
    }
    
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`
  }
  
  const navigateDate = (direction: number) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + direction)
    setSelectedDate(current.toISOString().split('T')[0])
  }
  
  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }
  
  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  
  return (
    <div className="flex items-center gap-md">
      <button
        onClick={() => navigateDate(-1)}
        className="p-2 rounded-md hover:bg-surface transition-colors"
      >
        ◀
      </button>
      
      <div className="text-h2 font-medium min-w-48 text-center">
        {formatDate(selectedDate)}
      </div>
      
      <button
        onClick={() => navigateDate(1)}
        className="p-2 rounded-md hover:bg-surface transition-colors"
      >
        ▶
      </button>
      
      {!isToday && (
        <button
          onClick={goToToday}
          className="px-3 py-1 text-small rounded-md bg-primary-100 text-primary-500 hover:bg-primary-100 transition-colors"
        >
          今天
        </button>
      )}
    </div>
  )
}
