import { create } from 'zustand'
import { Activity, DailyStats, WeeklyStats } from '../types/activity'
import { invoke } from '@tauri-apps/api/core'

interface ActivityState {
  activities: Activity[]
  dailyStats: DailyStats | null
  weeklyStats: WeeklyStats | null
  selectedDate: string
  isLoading: boolean
  
  loadTodayActivities: () => Promise<void>
  loadActivitiesByDate: (date: string) => Promise<void>
  loadDailyStats: (date: string) => Promise<void>
  loadWeeklyStats: (startDate: string, endDate: string) => Promise<void>
  updateActivity: (id: number, activityType: string, description?: string) => Promise<void>
  deleteActivity: (id: number) => Promise<void>
  setSelectedDate: (date: string) => void
}

export const activityStore = create<ActivityState>((set, get) => ({
  activities: [],
  dailyStats: null,
  weeklyStats: null,
  selectedDate: new Date().toISOString().split('T')[0],
  isLoading: false,
  
  loadTodayActivities: async () => {
    const today = new Date().toISOString().split('T')[0]
    await get().loadActivitiesByDate(today)
  },
  
  loadActivitiesByDate: async (date: string) => {
    set({ isLoading: true, selectedDate: date })
    try {
      const activities = await invoke<Activity[]>('get_activities', { date })
      set({ activities, isLoading: false })
      
      await get().loadDailyStats(date)
    } catch (error) {
      console.error('Failed to load activities:', error)
      set({ isLoading: false })
    }
  },
  
  loadDailyStats: async (date: string) => {
    try {
      const stats = await invoke<DailyStats>('get_daily_stats', { date })
      set({ dailyStats: stats })
    } catch (error) {
      console.error('Failed to load daily stats:', error)
    }
  },
  
  loadWeeklyStats: async (startDate: string, endDate: string) => {
    try {
      const stats = await invoke<WeeklyStats>('get_weekly_stats', { 
        startDate, 
        endDate 
      })
      set({ weeklyStats: stats })
    } catch (error) {
      console.error('Failed to load weekly stats:', error)
    }
  },
  
  updateActivity: async (id: number, activityType: string, description?: string) => {
    try {
      await invoke('update_activity', { 
        id, 
        activityType, 
        description: description || null 
      })
      
      const { selectedDate } = get()
      await get().loadActivitiesByDate(selectedDate)
    } catch (error) {
      console.error('Failed to update activity:', error)
    }
  },
  
  deleteActivity: async (id: number) => {
    try {
      await invoke('delete_activity', { id })
      
      const { selectedDate } = get()
      await get().loadActivitiesByDate(selectedDate)
    } catch (error) {
      console.error('Failed to delete activity:', error)
    }
  },
  
  setSelectedDate: (date: string) => {
    set({ selectedDate: date })
    get().loadActivitiesByDate(date)
  },
}))
