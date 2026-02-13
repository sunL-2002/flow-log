export interface Activity {
  id: number
  start_time: string
  end_time: string
  duration_seconds: number
  window_title: string
  activity_type: string
  description: string | null
  confidence: number
  is_edited: boolean
}

export interface NewActivity {
  start_time: string
  end_time: string
  duration_seconds: number
  window_title: string
  activity_type: string
  description?: string
  confidence: number
}

export interface DailyStats {
  date: string
  total_seconds: number
  breakdown: Record<string, number>
  activity_count: number
}

export interface WeeklyStats {
  start_date: string
  end_date: string
  total_seconds: number
  daily_breakdown: Record<string, number>
  type_breakdown: Record<string, number>
  activity_count: number
}

export const ACTIVITY_TYPES = {
  coding: { name: '编码', icon: '🟢', color: '#4CAF50' },
  meeting: { name: '会议', icon: '🔴', color: '#F44336' },
  communication: { name: '沟通', icon: '🟡', color: '#FFC107' },
  learning: { name: '学习', icon: '🟣', color: '#9C27B0' },
  design: { name: '设计', icon: '🎨', color: '#E91E63' },
  browsing: { name: '浏览', icon: '🌐', color: '#2196F3' },
  rest: { name: '休息', icon: '🔵', color: '#03A9F4' },
  other: { name: '其他', icon: '🟠', color: '#FF9800' },
  unknown: { name: '未识别', icon: '⚪', color: '#9E9E9E' },
} as const

export type ActivityTypeKey = keyof typeof ACTIVITY_TYPES
