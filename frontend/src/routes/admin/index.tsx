import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useAdminPosts, useDeletePost } from '@/hooks/admin-posts'
import { ErrorState } from '@/components/ErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { Pagination } from '@/components/Pagination'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { formatDate } from '@/lib/utils'

const PAGE_SIZE = 10

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
})

export const Route = createFileRoute('/admin/')({
  validateSearch: searchSchema,
  component: AdminPage,
})

function AdminPage() {
  const { page } = Route.useSearch()
  const { data, isLoading, isError, error, refetch } = useAdminPosts()
  const deletePost = useDeletePost()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const postCount = data?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(postCount / PAGE_SIZE))
  const pagePosts = data?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? []

  const pendingDeletePost = data?.find((p) => p.id === pendingDeleteId)

  function handleDeleteConfirm() {
    if (!pendingDeleteId) return
    deletePost.mutate(pendingDeleteId, {
      onSuccess: () => setPendingDeleteId(null),
    })
  }

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
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <caption className="sr-only">Admin posts list</caption>
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Updated</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Published</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pagePosts.map((post) => (
                  <tr key={post.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(post.updatedAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(post.id)}
                        className="rounded px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} to="/admin/" />

          <ConfirmDialog
            open={pendingDeleteId !== null}
            title="Delete post?"
            description={`"${pendingDeletePost?.title ?? ''}" will be permanently deleted.`}
            confirmLabel="Delete"
            loading={deletePost.isPending}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setPendingDeleteId(null)}
          />
        </>
      )}
    </section>
  )
}
