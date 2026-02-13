import { clsx } from 'clsx'
import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg bg-surface',
          {
            'shadow-sm': variant === 'default',
            'shadow-md hover:shadow-lg transition-shadow': variant === 'elevated',
            'border border-border': variant === 'outlined',
          },
          {
            'p-0': padding === 'none',
            'p-sm': padding === 'sm',
            'p-md': padding === 'md',
            'p-lg': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
