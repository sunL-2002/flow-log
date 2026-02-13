export interface AppSettings {
  auto_start: boolean
  minimize_to_tray: boolean
  show_daily_notification: boolean
  show_focus_reminder: boolean
  show_weekly_reminder: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
  work_start_time: string
  work_end_time: string
  poll_interval_ms: number
  first_launch: boolean
}

export interface RecognitionRule {
  id: number
  keywords: string
  activity_type: string
  confidence: number
  is_default: boolean
  is_enabled: boolean
}

export interface NewRule {
  keywords: string
  activity_type: string
  confidence?: number
}
