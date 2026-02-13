import { clsx } from 'clsx'
import { HTMLAttributes, forwardRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, isOpen, onClose, title, children, ...props }, ref) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'
      }
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
      }
    }, [isOpen, onClose])
    
    if (!isOpen) return null
    
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={clsx(
            'relative z-10 bg-bg rounded-xl shadow-xl',
            'w-full max-w-md mx-4',
            'animate-scale-in',
            className
          )}
          {...props}
        >
          {title && (
            <div className="flex items-center justify-between p-lg border-b border-border">
              <h2 className="text-h2 font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-surface transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          <div className="p-lg">
            {children}
          </div>
        </div>
      </div>,
      document.body
    )
  }
)

Modal.displayName = 'Modal'

export default Modal
