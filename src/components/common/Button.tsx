import { clsx } from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-md transition-all duration-100',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          {
            'bg-primary-500 text-white hover:bg-primary-700': variant === 'primary',
            'border border-primary-500 text-primary-500 hover:bg-primary-100': variant === 'secondary',
            'text-primary-500 hover:bg-primary-100': variant === 'text',
            'bg-error text-white hover:bg-red-700': variant === 'danger',
          },
          {
            'px-2 py-1 text-small': size === 'sm',
            'px-3 py-1.5 text-body': size === 'md',
            'px-4 py-2 text-body': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
