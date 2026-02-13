import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { listen } from '@tauri-apps/api/event'
import { activityStore } from './stores/activityStore'
import { settingsStore } from './stores/settingsStore'
import { uiStore } from './stores/uiStore'

import HomePage from './pages/HomePage'
import StatisticsPage from './pages/StatisticsPage'
import ReportPage from './pages/ReportPage'
import SettingsPage from './pages/SettingsPage'
import Onboarding from './components/onboarding/Onboarding'

import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import Toast from './components/common/Toast'

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  
  const { theme } = uiStore()
  
  useEffect(() => {
    const init = async () => {
      try {
        const { invoke } = await import('@tauri-apps/api/core')
        const isFirstLaunch = await invoke<boolean>('is_first_launch')
        
        if (isFirstLaunch) {
          setShowOnboarding(true)
        }
        
        await settingsStore.getState().loadSettings()
        await activityStore.getState().loadTodayActivities()
      } catch {
        console.error('Failed to initialize')
      } finally {
        setIsLoading(false)
      }
    }
    
    init()
  }, [])
  
  useEffect(() => {
    const unlisten = listen('navigate', (event) => {
      if (typeof event.payload === 'string') {
        navigate(event.payload)
      }
    })
    
    return () => {
      unlisten.then(fn => fn())
    }
  }, [navigate])
  
  useEffect(() => {
    const unlisten = listen('tracking-status', (event) => {
      const data = event.payload as { activity_type: string; confidence: number }
      uiStore.getState().setCurrentActivity(data.activity_type, data.confidence)
    })
    
    return () => {
      unlisten.then(fn => fn())
    }
  }, [])
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="text-text-secondary">加载中...</div>
      </div>
    )
  }
  
  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />
  }
  
  return (
    <div className="flex flex-col h-screen bg-bg text-text-primary">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Navigation />
        
        <main className="flex-1 overflow-auto p-lg">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      
      <Toast />
    </div>
  )
}

export default App
