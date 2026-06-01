interface EmptyStateProps {
  message: string
  hint?: string
}

export function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
      <p className="text-muted-foreground font-medium">{message}</p>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  )
}
