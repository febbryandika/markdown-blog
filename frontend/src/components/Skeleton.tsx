import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('bg-muted animate-pulse rounded', className)} />
}

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-card p-5">
      <Skeleton className="aspect-[16/9] w-full rounded-lg" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function PostListSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading posts…</span>
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-hidden="true"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function PostDetailSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading post…</span>
      <div className="mx-auto max-w-2xl" aria-hidden="true">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-3 w-44" />
        </div>
        <Skeleton className="mb-12 aspect-[2/1] w-full rounded-xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}

export function PostFormSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading post…</span>
      <div className="space-y-6" aria-hidden="true">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-[40vh] w-full" />
      </div>
    </div>
  )
}

export function AdminTableSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading posts…</span>
      <div className="overflow-x-auto rounded-lg border" aria-hidden="true">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['Title', 'Status', 'Updated', 'Published', ''].map((col, i) => (
                <th
                  key={col || 'actions'}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-left font-medium text-muted-foreground',
                    (i === 2 || i === 3) && 'hidden sm:table-cell',
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="bg-card">
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-48" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </td>
                <td className="hidden sm:table-cell px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="hidden sm:table-cell px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-12 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
