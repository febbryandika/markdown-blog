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
      <header className="mb-8">
        <h1 id="tag-heading" className="text-3xl font-bold tracking-tight leading-tight">
          Posts tagged <span className="text-primary">#{tag}</span>
        </h1>
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
