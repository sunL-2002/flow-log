import { useState } from 'react'
import { settingsStore } from '../../stores/settingsStore'
import Button from '../common/Button'

interface BasicSetupProps {
  selectedJobType: string
  onJobTypeChange: (type: string) => void
  onNext: () => void
}

const jobTypes = [
  { id: 'developer', label: '程序员', icon: '💻' },
  { id: 'designer', label: '设计师', icon: '🎨' },
  { id: 'pm', label: '产品经理', icon: '📊' },
  { id: 'other', label: '其他', icon: '👤' },
]

export default function BasicSetup({ selectedJobType, onJobTypeChange, onNext }: BasicSetupProps) {
  const { updateSettings } = settingsStore()
  const [autoStart, setAutoStart] = useState(true)
  const [dailyNotification, setDailyNotification] = useState(true)
  
  const handleNext = async () => {
    await updateSettings({ 
      auto_start: autoStart,
      show_daily_notification: dailyNotification 
    })
    onNext()
  }
  
  return (
    <div className="text-center">
      <div className="text-6xl mb-lg">⚙️</div>
      <h1 className="text-h1 font-bold mb-lg">快速设置</h1>
      
      <div className="bg-surface rounded-lg p-lg mb-xl text-left">
        <p className="text-body mb-md">你的工作类型是？</p>
        
        <div className="grid grid-cols-2 gap-sm mb-lg">
          {jobTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onJobTypeChange(type.id)}
              className={`p-md rounded-lg border-2 transition-colors ${
                selectedJobType === type.id 
                  ? 'border-primary-500 bg-primary-100' 
                  : 'border-border hover:border-primary-300'
              }`}
            >
              <div className="text-h2 mb-xs">{type.icon}</div>
              <div className="text-body">{type.label}</div>
            </button>
          ))}
        </div>
        
        <p className="text-small text-text-secondary mb-md">
          （这会帮助我们预设识别规则）
        </p>
        
        <div className="border-t border-border pt-md space-y-md">
          <label className="flex items-center gap-md cursor-pointer">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-body">开机自动启动</span>
          </label>
          
          <label className="flex items-center gap-md cursor-pointer">
            <input
              type="checkbox"
              checked={dailyNotification}
              onChange={(e) => setDailyNotification(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-body">每日下班时提醒我查看今日成就</span>
          </label>
        </div>
      </div>
      
      <Button size="lg" onClick={handleNext}>
        完成设置
      </Button>
    </div>
  )
}
