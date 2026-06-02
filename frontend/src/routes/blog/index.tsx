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
      <header className="mb-8">
        <h1
          id="blog-heading"
          className="text-3xl font-bold tracking-tight leading-tight"
        >
          Blog
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Latest posts</p>
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
