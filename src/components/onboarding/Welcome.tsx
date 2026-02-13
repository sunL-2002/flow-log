import Button from '../common/Button'

interface WelcomeProps {
  onNext: () => void
}

export default function Welcome({ onNext }: WelcomeProps) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-lg">🎯</div>
      <h1 className="text-display font-bold mb-md">欢迎使用 FlowLog</h1>
      <p className="text-h2 text-text-secondary mb-xl">
        "比你自己更清楚你今天到底干了什么"
      </p>
      
      <div className="bg-surface rounded-lg p-lg mb-xl text-left">
        <p className="text-body mb-md">我会在后台默默记录你的工作，帮你回答：</p>
        <ul className="space-y-sm text-body">
          <li>• 今天专注了多久？</li>
          <li>• 时间都花在哪里了？</li>
          <li>• 周报该怎么写？</li>
        </ul>
      </div>
      
      <Button size="lg" onClick={onNext}>
        开始使用 →
      </Button>
    </div>
  )
}
