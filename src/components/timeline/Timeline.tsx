import { activityStore } from '../../stores/activityStore'
import { Activity, ACTIVITY_TYPES } from '../../types/activity'
import Card from '../common/Card'
import Tag from '../common/Tag'
import Button from '../common/Button'
import { useState } from 'react'
import Modal from '../common/Modal'

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

export default function Timeline() {
  const { activities, updateActivity } = activityStore()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editType, setEditType] = useState('coding')
  const [editDescription, setEditDescription] = useState('')
  
  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id)
    setEditType(activity.activity_type)
    setEditDescription(activity.description || '')
  }
  
  const handleSave = async () => {
    if (editingId) {
      await updateActivity(editingId, editType, editDescription)
      setEditingId(null)
    }
  }
  
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-secondary">
        <div className="text-4xl mb-md">📭</div>
        <div>暂无记录</div>
        <div className="text-small">FlowLog 正在后台默默工作...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-md">
      {activities.map((activity) => (
        <Card 
          key={activity.id}
          variant="elevated"
          className="hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-md mb-sm">
                <span className="text-body font-medium">
                  {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
                </span>
                <Tag type={activity.activity_type as keyof typeof ACTIVITY_TYPES} />
                <span className="text-small text-text-secondary">
                  {formatDuration(activity.duration_seconds)}
                </span>
                {activity.confidence < 80 && (
                  <span className="text-tiny text-warning">
                    ⚠️ 置信度 {activity.confidence}%
                  </span>
                )}
              </div>
              
              <div className="text-body text-text-secondary mb-sm">
                📌 {activity.window_title}
              </div>
              
              {activity.description && (
                <div className="text-small text-text-secondary">
                  📝 {activity.description}
                </div>
              )}
            </div>
            
            <Button 
              variant="text" 
              size="sm"
              onClick={() => handleEdit(activity)}
            >
              ✏️ 修正
            </Button>
          </div>
        </Card>
      ))}
      
      <Modal
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        title="修正活动标签"
      >
        <div className="space-y-md">
          <div>
            <label className="block text-small text-text-secondary mb-sm">活动类型</label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(ACTIVITY_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.icon} {value.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-small text-text-secondary mb-sm">描述（可选）</label>
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="添加描述..."
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex justify-end gap-sm">
            <Button variant="secondary" onClick={() => setEditingId(null)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
