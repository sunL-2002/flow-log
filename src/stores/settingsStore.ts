import { create } from 'zustand'
import { AppSettings, RecognitionRule, NewRule } from '../types/settings'
import { invoke } from '@tauri-apps/api/core'

interface SettingsState {
  settings: AppSettings | null
  rules: RecognitionRule[]
  isLoading: boolean
  
  loadSettings: () => Promise<void>
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>
  loadRules: () => Promise<void>
  addRule: (rule: NewRule) => Promise<void>
  updateRule: (id: number, keywords: string, activityType: string, confidence: number) => Promise<void>
  deleteRule: (id: number) => Promise<void>
}

const defaultSettings: AppSettings = {
  auto_start: true,
  minimize_to_tray: true,
  show_daily_notification: true,
  show_focus_reminder: false,
  show_weekly_reminder: true,
  theme: 'light',
  language: 'zh-CN',
  work_start_time: '09:00',
  work_end_time: '18:00',
  poll_interval_ms: 1000,
  first_launch: true,
}

export const settingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  rules: [],
  isLoading: false,
  
  loadSettings: async () => {
    set({ isLoading: true })
    try {
      const settings = await invoke<AppSettings>('get_settings')
      set({ settings: { ...defaultSettings, ...settings }, isLoading: false })
    } catch (error) {
      console.error('Failed to load settings:', error)
      set({ settings: defaultSettings, isLoading: false })
    }
  },
  
  updateSettings: async (newSettings: Partial<AppSettings>) => {
    const { settings } = get()
    if (!settings) return
    
    const updated = { ...settings, ...newSettings }
    
    try {
      await invoke('update_settings', { settings: updated })
      set({ settings: updated })
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  },
  
  loadRules: async () => {
    try {
      const rules = await invoke<RecognitionRule[]>('get_rules')
      set({ rules })
    } catch (error) {
      console.error('Failed to load rules:', error)
    }
  },
  
  addRule: async (rule: NewRule) => {
    try {
      await invoke('add_rule', { rule })
      await get().loadRules()
    } catch (error) {
      console.error('Failed to add rule:', error)
    }
  },
  
  updateRule: async (id: number, keywords: string, activityType: string, confidence: number) => {
    try {
      await invoke('update_rule', { id, keywords, activityType, confidence })
      await get().loadRules()
    } catch (error) {
      console.error('Failed to update rule:', error)
    }
  },
  
  deleteRule: async (id: number) => {
    try {
      await invoke('delete_rule', { id })
      await get().loadRules()
    } catch (error) {
      console.error('Failed to delete rule:', error)
    }
  },
}))
