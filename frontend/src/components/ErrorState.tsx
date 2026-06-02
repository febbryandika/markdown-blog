import { buttonOutline } from '@/lib/ui'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Something went wrong while loading this content.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 py-24 text-center"
    >
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-destructive">
        Error
      </p>
      <p className="max-w-md font-display text-2xl font-semibold tracking-tight">
        {message}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={buttonOutline}>
          Try again
        </button>
      )}
    </div>
  )
}
