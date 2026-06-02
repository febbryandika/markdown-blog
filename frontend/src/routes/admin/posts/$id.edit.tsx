import { createFileRoute, useRouter } from '@tanstack/react-router'
import { PostForm } from '@/components/admin/PostForm'
import { useAdminPost, useUpdatePost } from '@/hooks/admin-posts'
import { toPostPayload } from '@/lib/post-schema'
import { ErrorState } from '@/components/ErrorState'
import { PostFormSkeleton } from '@/components/Skeleton'

export const Route = createFileRoute('/admin/posts/$id/edit')({
  component: EditPostPage,
})

function EditPostPage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const post = useAdminPost(id)
  const updatePost = useUpdatePost(id)

  return (
    <section aria-labelledby="edit-post-heading">
      <header className="mb-8">
        <h1 id="edit-post-heading" className="text-3xl font-bold tracking-tight leading-tight">Edit post</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update your post and save your changes.</p>
      </header>

      {post.isLoading && <PostFormSkeleton />}

      {post.isError && (
        <ErrorState
          message={post.error instanceof Error ? post.error.message : 'Failed to load post.'}
          onRetry={() => post.refetch()}
        />
      )}

      {!post.isLoading && !post.isError && post.data && (
        <PostForm
          initialValues={{
            title: post.data.title,
            slug: post.data.slug,
            excerpt: post.data.excerpt ?? '',
            content: post.data.content,
            status: post.data.status,
            categoryId: post.data.categoryId ?? '',
            tags: post.data.tags,
          }}
          submitting={updatePost.isPending}
          submitError={updatePost.error?.message ?? null}
          submitLabel="Save changes"
          submittingLabel="Saving…"
          onSubmit={(values) =>
            updatePost.mutate(toPostPayload(values), {
              onSuccess: () => router.navigate({ to: '/admin' }),
            })
          }
        />
      )}
    </section>
  )
}
