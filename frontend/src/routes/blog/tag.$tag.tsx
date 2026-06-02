import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { usePosts } from '@/hooks/posts'
import { PostListView } from '@/components/PostListView'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
})

export const Route = createFileRoute('/blog/tag/$tag')({
  validateSearch: searchSchema,
  component: TagPage,
})

function TagPage() {
  const { tag } = Route.useParams()
  const { page } = Route.useSearch()
  const query = usePosts({ page, tag })

  return (
    <section aria-labelledby="tag-heading">
      <header className="animate-fade-up mb-10 border-b border-border/70 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">
          Tag
        </p>
        <h1
          id="tag-heading"
          className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
        >
          #{tag}
        </h1>
        <p className="mt-3 text-muted-foreground">
          Every post filed under <span className="text-foreground">{tag}</span>.
        </p>
      </header>
      <PostListView
        query={query}
        page={page}
        to="/blog/tag/$tag"
        params={{ tag }}
        emptyMessage={`No posts found for tag "${tag}".`}
      />
    </section>
  )
}
