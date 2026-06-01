import { Link } from '@tanstack/react-router'

interface PaginationProps {
  page: number
  totalPages: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
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
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          ← Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          aria-label="No previous page"
          className="rounded-md border px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50"
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
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          Next →
        </Link>
      ) : (
        <span
          aria-disabled="true"
          aria-label="No next page"
          className="rounded-md border px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50"
        >
          Next →
        </span>
      )}
    </nav>
  )
}
