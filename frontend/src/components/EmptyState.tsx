import type { ReactNode } from 'react'

interface EmptyStateProps {
  message: string
  hint?: string
  action?: ReactNode
}

export function EmptyState({ message, hint, action }: EmptyStateProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center py-20 gap-2 text-center">
      <p className="text-muted-foreground font-medium">{message}</p>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
