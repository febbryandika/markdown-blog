import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useAdminPosts, useDeletePost } from '@/hooks/admin-posts'
import { ErrorState } from '@/components/ErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { Pagination } from '@/components/Pagination'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { AdminTableSkeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { Table, THead, TBody, TR, TH, TD } from '@/components/admin/Table'
import { formatDate } from '@/lib/utils'
import { buttonPrimary } from '@/lib/ui'

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
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 id="admin-heading" className="text-3xl font-bold tracking-tight leading-tight">Posts</h1>
          {!isLoading && !isError && (
            <p className="mt-1 text-sm text-muted-foreground">
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </p>
          )}
        </div>
        <Link to="/admin/posts/new" className={buttonPrimary}>
          New post
        </Link>
      </header>

      {isLoading && <AdminTableSkeleton />}

      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : 'Failed to load posts.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          message="No posts yet."
          hint="Create your first post to get started."
          action={
            <Link
              to="/admin/posts/new"
              className={buttonPrimary}
            >
              New post
            </Link>
          }
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <>
          <Table>
            <caption className="sr-only">Admin posts list</caption>
            <THead>
              <tr>
                <TH>Title</TH>
                <TH>Status</TH>
                <TH className="hidden sm:table-cell whitespace-nowrap">Updated</TH>
                <TH className="hidden sm:table-cell whitespace-nowrap">Published</TH>
                <TH><span className="sr-only">Actions</span></TH>
              </tr>
            </THead>
            <TBody>
              {pagePosts.map((post) => (
                <TR key={post.id}>
                  <TD className="font-medium max-w-[9rem] truncate sm:max-w-xs">{post.title}</TD>
                  <TD><StatusBadge status={post.status} /></TD>
                  <TD className="hidden sm:table-cell text-muted-foreground whitespace-nowrap">{formatDate(post.updatedAt)}</TD>
                  <TD className="hidden sm:table-cell text-muted-foreground whitespace-nowrap">
                    {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                  </TD>
                  <TD className="text-right">
                    <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <Link
                        to="/admin/posts/$id/edit"
                        params={{ id: post.id }}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(post.id)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          <Pagination page={page} totalPages={totalPages} to="/admin" />

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
