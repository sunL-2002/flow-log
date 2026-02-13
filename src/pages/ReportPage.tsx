import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { WeeklyReport } from '../types/report'
import { uiStore } from '../stores/uiStore'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

export default function ReportPage() {
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = uiStore()
  
  const generateReport = async () => {
    setIsLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const result = await invoke<WeeklyReport>('generate_weekly_report', { endDate: today })
      setReport(result)
    } catch {
      showToast('error', '生成周报失败')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    generateReport()
  }, [])
  
  const copyToClipboard = async () => {
    if (!report) return
    
    const text = formatReportText(report)
    
    try {
      await navigator.clipboard.writeText(text)
      showToast('success', '已复制到剪贴板')
    } catch {
      showToast('error', '复制失败')
    }
  }
  
  const formatReportText = (rep: WeeklyReport): string => {
    const lines: string[] = []
    
    lines.push(`周报 (${rep.start_date} - ${rep.end_date})`)
    lines.push('')
    
    const totalHours = (rep.total_seconds / 3600).toFixed(1)
    lines.push(`本周总专注时长: ${totalHours} 小时`)
    lines.push('')
    
    lines.push('时间分配:')
    for (const [type, seconds] of Object.entries(rep.type_breakdown || {})) {
      const hours = (seconds / 3600).toFixed(1)
      lines.push(`  ${type}: ${hours} 小时`)
    }
    
    lines.push('')
    lines.push('每日详情:')
    for (const day of rep.daily_activities) {
      const hours = (day.total_seconds / 3600).toFixed(1)
      lines.push(`  ${day.date}: ${hours} 小时`)
    }
    
    return lines.join('\n')
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-lg">
        <h2 className="text-h1 font-bold">周报</h2>
        <div className="flex gap-sm">
          <Button onClick={generateReport} disabled={isLoading}>
            {isLoading ? '生成中...' : '重新生成'}
          </Button>
          {report && (
            <Button variant="secondary" onClick={copyToClipboard}>
              📋 复制到剪贴板
            </Button>
          )}
        </div>
      </div>
      
      {report ? (
        <div className="flex-1 overflow-auto">
          <Card className="mb-lg">
            <div className="flex items-center gap-lg">
              <div>
                <div className="text-small text-text-secondary">本周总专注时长</div>
                <div className="text-display font-bold text-primary-500">
                  {(report.total_seconds / 3600).toFixed(1)} 小时
                </div>
              </div>
              <div>
                <div className="text-small text-text-secondary">时间范围</div>
                <div className="text-h2">
                  {report.start_date} - {report.end_date}
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="mb-lg">
            <h3 className="text-h2 font-semibold mb-md">时间分配</h3>
            <div className="grid grid-cols-4 gap-md">
              {Object.entries(report.type_breakdown || {}).map(([type, seconds]) => (
                <div key={type} className="text-center p-md bg-surface rounded-lg">
                  <div className="text-h2 font-bold">{((seconds as number) / 3600).toFixed(1)}h</div>
                  <div className="text-small text-text-secondary">{type}</div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card>
            <h3 className="text-h2 font-semibold mb-md">每日详情</h3>
            <div className="space-y-sm">
              {report.daily_activities.map((day) => (
                <div 
                  key={day.date}
                  className="flex items-center justify-between p-sm bg-surface rounded-md"
                >
                  <span className="text-body">{day.date}</span>
                  <span className="text-body font-medium">
                    {(day.total_seconds / 3600).toFixed(1)} 小时
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-text-secondary">
            {isLoading ? '正在生成周报...' : '暂无数据'}
          </div>
        </div>
      )}
    </div>
  )
}
