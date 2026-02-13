import { useState, useEffect } from 'react'
import { settingsStore } from '../stores/settingsStore'
import { uiStore } from '../stores/uiStore'
import { invoke } from '@tauri-apps/api/core'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function SettingsPage() {
  const { settings, updateSettings, loadRules, rules, addRule, deleteRule } = settingsStore()
  const { theme, setTheme, showToast } = uiStore()
  const [newKeyword, setNewKeyword] = useState('')
  const [newActivityType, setNewActivityType] = useState('coding')
  
  useEffect(() => {
    loadRules()
  }, [loadRules])
  
  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    await updateSettings({ theme: newTheme })
  }
  
  const handleToggle = async (key: string, value: boolean) => {
    if (settings) {
      await updateSettings({ [key]: value })
    }
  }
  
  const handleAddRule = async () => {
    if (!newKeyword.trim()) return
    
    await addRule({
      keywords: newKeyword,
      activity_type: newActivityType,
    })
    
    setNewKeyword('')
    showToast('success', '规则已添加')
  }
  
  const handleExportData = async () => {
    try {
      const data = await invoke<string>('export_data')
      await navigator.clipboard.writeText(data)
      showToast('success', '数据已复制到剪贴板')
    } catch {
      showToast('error', '导出失败')
    }
  }
  
  const handleClearData = async () => {
    if (!confirm('确定要清空所有数据吗？此操作不可恢复！')) return
    
    try {
      await invoke('clear_all_data')
      showToast('success', '数据已清空')
    } catch {
      showToast('error', '清空失败')
    }
  }
  
  return (
    <div className="flex flex-col h-full overflow-auto">
      <h2 className="text-h1 font-bold mb-lg">设置</h2>
      
      <div className="space-y-lg">
        <Card>
          <h3 className="text-h2 font-semibold mb-md">🔒 隐私设置</h3>
          <div className="space-y-md">
            <label className="flex items-center justify-between">
              <span className="text-body">开机自动启动</span>
              <input
                type="checkbox"
                checked={settings?.auto_start ?? true}
                onChange={(e) => handleToggle('auto_start', e.target.checked)}
                className="w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-body">最小化到系统托盘</span>
              <input
                type="checkbox"
                checked={settings?.minimize_to_tray ?? true}
                onChange={(e) => handleToggle('minimize_to_tray', e.target.checked)}
                className="w-4 h-4"
              />
            </label>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-h2 font-semibold mb-md">🔔 通知设置</h3>
          <div className="space-y-md">
            <label className="flex items-center justify-between">
              <span className="text-body">每日成就通知</span>
              <input
                type="checkbox"
                checked={settings?.show_daily_notification ?? true}
                onChange={(e) => handleToggle('show_daily_notification', e.target.checked)}
                className="w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-body">专注提醒</span>
              <input
                type="checkbox"
                checked={settings?.show_focus_reminder ?? false}
                onChange={(e) => handleToggle('show_focus_reminder', e.target.checked)}
                className="w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-body">周报提醒</span>
              <input
                type="checkbox"
                checked={settings?.show_weekly_reminder ?? true}
                onChange={(e) => handleToggle('show_weekly_reminder', e.target.checked)}
                className="w-4 h-4"
              />
            </label>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-h2 font-semibold mb-md">🎨 外观设置</h3>
          <div className="flex gap-md">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 p-md rounded-lg border-2 transition-colors ${
                theme === 'light' ? 'border-primary-500 bg-primary-100' : 'border-border'
              }`}
            >
              ☀️ 浅色
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 p-md rounded-lg border-2 transition-colors ${
                theme === 'dark' ? 'border-primary-500 bg-primary-100' : 'border-border'
              }`}
            >
              🌙 深色
            </button>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-h2 font-semibold mb-md">🏷️ 识别规则</h3>
          
          <div className="mb-md">
            <div className="flex gap-sm mb-sm">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="窗口关键词（逗号分隔）"
                className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                value={newActivityType}
                onChange={(e) => setNewActivityType(e.target.value)}
                className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="coding">编码</option>
                <option value="meeting">会议</option>
                <option value="communication">沟通</option>
                <option value="learning">学习</option>
                <option value="design">设计</option>
                <option value="other">其他</option>
              </select>
              <Button onClick={handleAddRule}>添加</Button>
            </div>
          </div>
          
          <div className="space-y-sm max-h-48 overflow-auto">
            {rules.map((rule) => (
              <div 
                key={rule.id}
                className="flex items-center justify-between p-sm bg-surface rounded-md"
              >
                <div>
                  <span className="text-body">{rule.keywords}</span>
                  <span className="text-small text-text-secondary ml-sm">
                    → {rule.activity_type}
                  </span>
                </div>
                {!rule.is_default && (
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="text-error text-small hover:underline"
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
        
        <Card>
          <h3 className="text-h2 font-semibold mb-md">📦 数据管理</h3>
          <div className="flex gap-md">
            <Button variant="secondary" onClick={handleExportData}>
              导出数据
            </Button>
            <Button variant="danger" onClick={handleClearData}>
              清空所有数据
            </Button>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-h2 font-semibold mb-md">ℹ️ 关于</h3>
          <div className="text-body text-text-secondary">
            <p>FlowLog v1.0.0</p>
            <p>一款帮助你了解"今天到底干了什么"的效率工具</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
