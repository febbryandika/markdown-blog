import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { usePosts } from '@/hooks/posts'
import { PostListView } from '@/components/PostListView'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
})

export const Route = createFileRoute('/blog/')({
  validateSearch: searchSchema,
  component: BlogPage,
})

function BlogPage() {
  const { page } = Route.useSearch()
  const query = usePosts({ page })

  return (
    <section aria-labelledby="blog-heading">
      <header className="animate-fade-up mb-10 border-b border-border/70 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">
          The Journal
        </p>
        <h1
          id="blog-heading"
          className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
        >
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Essays, notes, and experiments — newest first.
        </p>
      </header>
      <PostListView
        query={query}
        page={page}
        to="/blog"
        emptyMessage="No posts published yet."
      />
    </section>
  )
}
