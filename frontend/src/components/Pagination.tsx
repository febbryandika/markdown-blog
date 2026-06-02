import { Link, type LinkProps } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { buttonBase, buttonOutline } from '@/lib/ui'

interface PaginationProps {
  page: number
  totalPages: number
  to: LinkProps['to']
  params?: LinkProps['params']
}

export function Pagination({ page, totalPages, to, params }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-10">
      {page > 1 ? (
        <Link
          to={to}
          params={params}
          search={{ page: page - 1 }}
          aria-label="Go to previous page"
          className={buttonOutline}
        >
          ← Previous
        </Link>
      ) : (
        <span
          aria-label="No previous page"
          className={cn(buttonBase, 'border text-muted-foreground opacity-50 cursor-not-allowed')}
        >
          ← Previous
        </span>
      )}

      <span className="text-sm text-muted-foreground" aria-live="polite">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          to={to}
          params={params}
          search={{ page: page + 1 }}
          aria-label="Go to next page"
          className={buttonOutline}
        >
          Next →
        </Link>
      ) : (
        <span
          aria-label="No next page"
          className={cn(buttonBase, 'border text-muted-foreground opacity-50 cursor-not-allowed')}
        >
          Next →
        </span>
      )}
    </nav>
  )
}
