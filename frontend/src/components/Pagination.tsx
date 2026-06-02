import { Link, type LinkProps } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  to: LinkProps['to']
  params?: LinkProps['params']
}

const pillBase =
  'inline-flex items-center gap-1.5 rounded-full border border-border/70 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em]'
const pillActive = cn(
  pillBase,
  'transition-colors hover:border-brand/50 hover:text-brand',
)
const pillDisabled = cn(
  pillBase,
  'cursor-not-allowed text-muted-foreground opacity-40',
)

export function Pagination({ page, totalPages, to, params }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-4"
    >
      {page > 1 ? (
        <Link
          to={to}
          params={params}
          search={{ page: page - 1 }}
          aria-label="Go to previous page"
          className={pillActive}
        >
          ← Prev
        </Link>
      ) : (
        <span aria-label="No previous page" className={pillDisabled}>
          ← Prev
        </span>
      )}

      <span
        className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
        aria-live="polite"
      >
        {page} / {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          to={to}
          params={params}
          search={{ page: page + 1 }}
          aria-label="Go to next page"
          className={pillActive}
        >
          Next →
        </Link>
      ) : (
        <span aria-label="No next page" className={pillDisabled}>
          Next →
        </span>
      )}
    </nav>
  )
}
