export interface WeeklyReport {
  start_date: string
  end_date: string
  total_seconds: number
  daily_activities: DayActivities[]
  summary: ActivitySummary[]
  type_breakdown?: Record<string, number>
}

export interface DayActivities {
  date: string
  activities: ActivitySummary[]
  total_seconds: number
}

export interface ActivitySummary {
  activity_type: string
  total_seconds: number
  description: string | null
  count: number
}
