import { buttonOutline } from '@/lib/ui'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong while loading this content.', onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <p className="text-destructive font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={buttonOutline}
        >
          Try again
        </button>
      )}
    </div>
  )
}
