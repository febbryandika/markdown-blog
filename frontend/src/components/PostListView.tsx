import type { UseQueryResult } from '@tanstack/react-query'
import type { PostsResponse } from '@/hooks/posts'
import { PostCard } from './PostCard'
import { Pagination } from './Pagination'
import { PostListSkeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'

interface PostListViewProps {
  query: UseQueryResult<PostsResponse>
  page: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
  emptyMessage: string
}

export function PostListView({ query, page, to, params, emptyMessage }: PostListViewProps) {
  const { data, isLoading, isError, error, refetch } = query

  if (isLoading) return <PostListSkeleton />

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Failed to load posts.'}
        onRetry={() => refetch()}
      />
    )
  }

  if (!data || data.posts.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination page={page} totalPages={data.totalPages} to={to} params={params} />
    </div>
  )
}
