import { clsx } from 'clsx'
import { ACTIVITY_TYPES, ActivityTypeKey } from '../../types/activity'

interface TagProps {
  type: ActivityTypeKey
  size?: 'sm' | 'md'
}

export default function Tag({ type, size = 'md' }: TagProps) {
  const info = ACTIVITY_TYPES[type] || ACTIVITY_TYPES.unknown
  
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded font-medium',
        {
          'px-2 py-0.5 text-tiny': size === 'sm',
          'px-2.5 py-1 text-small': size === 'md',
        }
      )}
      style={{
        backgroundColor: `${info.color}20`,
        color: info.color,
      }}
    >
      <span>{info.icon}</span>
      <span>{info.name}</span>
    </span>
  )
}
