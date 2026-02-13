import { clsx } from 'clsx'
import { uiStore } from '../../stores/uiStore'

export default function Toast() {
  const { toasts, removeToast } = uiStore()
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg',
            'animate-slide-up',
            {
              'bg-green-100 text-green-800 border border-green-300': toast.type === 'success',
              'bg-red-100 text-red-800 border border-red-300': toast.type === 'error',
              'bg-yellow-100 text-yellow-800 border border-yellow-300': toast.type === 'warning',
              'bg-blue-100 text-blue-800 border border-blue-300': toast.type === 'info',
            }
          )}
        >
          <span className="text-body">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-current opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
