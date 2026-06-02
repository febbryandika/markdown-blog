import { createFileRoute, useRouter } from '@tanstack/react-router'
import { PostForm } from '@/components/admin/PostForm'
import { useCreatePost } from '@/hooks/admin-posts'
import { toPostPayload } from '@/lib/post-schema'

export const Route = createFileRoute('/admin/posts/new')({
  component: NewPostPage,
})

function NewPostPage() {
  const router = useRouter()
  const createPost = useCreatePost()

  return (
    <section aria-labelledby="new-post-heading">
      <header className="mb-8">
        <h1
          id="new-post-heading"
          className="text-3xl font-bold tracking-tight leading-tight"
        >
          New post
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write your post in Markdown.
        </p>
      </header>

      <PostForm
        submitting={createPost.isPending}
        submitError={createPost.error?.message ?? null}
        submitLabel="Create post"
        submittingLabel="Creating…"
        onSubmit={(values) =>
          createPost.mutate(toPostPayload(values), {
            onSuccess: () => router.navigate({ to: '/admin' }),
          })
        }
      />
    </section>
  )
}
