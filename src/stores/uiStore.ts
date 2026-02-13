import { create } from 'zustand'

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface UIState {
  theme: 'light' | 'dark'
  currentActivity: string
  currentConfidence: number
  isTracking: boolean
  toasts: ToastMessage[]
  
  setTheme: (theme: 'light' | 'dark') => void
  setCurrentActivity: (activity: string, confidence: number) => void
  setTracking: (tracking: boolean) => void
  showToast: (type: ToastMessage['type'], message: string) => void
  removeToast: (id: string) => void
}

export const uiStore = create<UIState>((set, get) => ({
  theme: 'light',
  currentActivity: 'unknown',
  currentConfidence: 0,
  isTracking: true,
  toasts: [],
  
  setTheme: (theme) => {
    set({ theme })
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },
  
  setCurrentActivity: (activity, confidence) => {
    set({ currentActivity: activity, currentConfidence: confidence })
  },
  
  setTracking: (tracking) => {
    set({ isTracking: tracking })
  },
  
  showToast: (type, message) => {
    const id = Date.now().toString()
    const toast = { id, type, message }
    
    set((state) => ({ toasts: [...state.toasts, toast] }))
    
    setTimeout(() => {
      get().removeToast(id)
    }, 3000)
  },
  
  removeToast: (id) => {
    set((state) => ({ 
      toasts: state.toasts.filter(t => t.id !== id) 
    }))
  },
}))
