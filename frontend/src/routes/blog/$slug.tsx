import { createFileRoute, Link } from '@tanstack/react-router'
import { usePost } from '@/hooks/posts'
import { PostBody } from '@/components/PostBody'
import { TagBadge } from '@/components/TagBadge'
import { PostDetailSkeleton } from '@/components/Skeleton'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/blog/$slug')({
  component: PostPage,
})

function PostPage() {
  const { slug } = Route.useParams()
  const { data: post, isLoading, isError, error, refetch } = usePost(slug)

  if (isLoading) return <PostDetailSkeleton />

  if (isError) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return (
        <EmptyState
          message="Post not found"
          hint="This post may have been moved or deleted."
          action={
            <Link to="/blog" className="text-sm text-primary hover:underline">
              ← Back to blog
            </Link>
          }
        />
      )
    }
    return (
      <ErrorState
        message="Failed to load this post."
        onRetry={() => refetch()}
      />
    )
  }

  if (!post) return null

  return (
    <article className="max-w-2xl mx-auto" aria-labelledby="post-title">
      <Link
        to="/blog"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Blog
      </Link>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt=""
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <header className="mb-8">
        <h1
          id="post-title"
          className="text-3xl font-bold tracking-tight leading-tight mb-3"
        >
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          )}
          {post.readingTime != null && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </header>

      <PostBody html={post.html} />

      <nav
        aria-label="Post navigation"
        className="mt-12 pt-8 border-t grid grid-cols-2 gap-4"
      >
        <div>
          {post.prev && (
            <Link
              to="/blog/$slug"
              params={{ slug: post.prev.slug }}
              className="group flex flex-col gap-1"
              aria-label={`Previous post: ${post.prev.title}`}
            >
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                ← Previous
              </span>
              <span className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {post.prev.title}
              </span>
            </Link>
          )}
        </div>

        <div className="text-right">
          {post.next && (
            <Link
              to="/blog/$slug"
              params={{ slug: post.next.slug }}
              className="group flex flex-col gap-1 items-end"
              aria-label={`Next post: ${post.next.title}`}
            >
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Next →
              </span>
              <span className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {post.next.title}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  )
}
