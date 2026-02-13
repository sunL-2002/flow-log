import Button from '../common/Button'

interface SetupCompleteProps {
  onComplete: () => void
}

export default function SetupComplete({ onComplete }: SetupCompleteProps) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-lg">🎉</div>
      <h1 className="text-h1 font-bold mb-lg">一切就绪！</h1>
      
      <div className="bg-surface rounded-lg p-lg mb-xl text-left">
        <p className="text-body mb-md">FlowLog 已经开始在后台默默工作了</p>
        
        <p className="text-body mb-md">你不需要做任何操作，只需要：</p>
        
        <ol className="space-y-sm text-body mb-md">
          <li>1. 正常工作</li>
          <li>2. 随时点击托盘图标查看今天干了什么</li>
          <li>3. 周五用周报功能快速生成周报</li>
        </ol>
        
        <div className="bg-bg rounded-md p-md">
          <p className="text-small text-text-secondary">
            💡 小提示：如果识别不准确，点击时间轴卡片上的"修正"即可
          </p>
        </div>
      </div>
      
      <Button size="lg" onClick={onComplete}>
        开始工作
      </Button>
    </div>
  )
}
