import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'draft' | 'published'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        status === 'published'
          ? 'bg-primary/10 text-primary'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  )
}
