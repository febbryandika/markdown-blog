import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useAdminPosts } from '@/hooks/admin-posts'
import { ErrorState } from '@/components/ErrorState'
import { formatDate } from '@/lib/utils'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
})

export const Route = createFileRoute('/admin/')({
  validateSearch: searchSchema,
  component: AdminPage,
})

function AdminPage() {
  const { data, isLoading, isError, error, refetch } = useAdminPosts()

  const postCount = data?.length ?? 0

  return (
    <section aria-labelledby="admin-heading">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 id="admin-heading" className="text-2xl font-bold tracking-tight">Posts</h1>
          {!isLoading && !isError && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </p>
          )}
        </div>
      </header>

      {isLoading && (
        <p className="text-sm text-muted-foreground py-10 text-center">Loading posts…</p>
      )}

      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : 'Failed to load posts.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && data && (
        <ul className="flex flex-col gap-2">
          {data.map((post) => (
            <li key={post.id} className="rounded-md border bg-card px-4 py-3 text-sm flex items-center gap-4">
              <span className="flex-1 font-medium truncate">{post.title}</span>
              <span className="text-muted-foreground capitalize">{post.status}</span>
              <span className="text-muted-foreground">{formatDate(post.updatedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
