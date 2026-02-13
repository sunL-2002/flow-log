import Button from '../common/Button'

interface PermissionRequestProps {
  onNext: () => void
}

export default function PermissionRequest({ onNext }: PermissionRequestProps) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-lg">🔐</div>
      <h1 className="text-h1 font-bold mb-lg">需要你的授权</h1>
      
      <div className="bg-surface rounded-lg p-lg mb-xl text-left">
        <p className="text-body mb-md">为了识别你在做什么，FlowLog 需要：</p>
        
        <div className="flex items-start gap-md mb-md p-md bg-bg rounded-md">
          <span className="text-h2">📌</span>
          <div>
            <p className="font-medium">获取窗口标题</p>
            <p className="text-small text-text-secondary">用于识别你正在使用的应用程序</p>
          </div>
        </div>
        
        <div className="border-t border-border pt-md mt-md">
          <p className="font-medium mb-sm">🔒 我们承诺：</p>
          <ul className="space-y-sm text-small text-text-secondary">
            <li>• 所有数据只存在你的电脑里</li>
            <li>• 不会上传到任何服务器</li>
            <li>• 你可以随时暂停或删除数据</li>
          </ul>
        </div>
      </div>
      
      <div className="flex gap-md justify-center">
        <Button variant="secondary" onClick={() => {}}>
          了解更多
        </Button>
        <Button onClick={onNext}>
          授予权限 →
        </Button>
      </div>
    </div>
  )
}
