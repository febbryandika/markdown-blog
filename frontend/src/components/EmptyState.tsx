import type { ReactNode } from 'react'

interface EmptyStateProps {
  message: string
  hint?: string
  action?: ReactNode
}

export function EmptyState({ message, hint, action }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-24 text-center"
    >
      <span aria-hidden="true" className="font-display text-4xl text-brand/50">
        ✦
      </span>
      <p className="font-display text-2xl font-semibold tracking-tight">
        {message}
      </p>
      {hint && <p className="max-w-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
