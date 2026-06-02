import { createFileRoute, Link } from '@tanstack/react-router'
import { usePost } from '@/hooks/posts'
import { PostBody } from '@/components/PostBody'
import { TagBadge } from '@/components/TagBadge'
import { ReadingProgress } from '@/components/ReadingProgress'
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
            <Link
              to="/blog"
              className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand transition-colors hover:text-foreground"
            >
              ← Back to blog
            </Link>
          }
        />
      )
    }
    return (
      <ErrorState message="Failed to load this post." onRetry={() => refetch()} />
    )
  }

  if (!post) return null

  const kicker = post.tags[0] ?? 'Article'

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-2xl" aria-labelledby="post-title">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-brand"
        >
          ← Back to blog
        </Link>

        <header className="animate-fade-up mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand">
            {kicker}
          </p>
          <h1
            id="post-title"
            className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
          >
            {post.title}
          </h1>
          <div className="mt-5 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
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
        </header>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="animate-fade-up mb-12 aspect-[2/1] w-full rounded-xl border object-cover"
          />
        )}

        <PostBody html={post.html} />

        {post.tags.length > 0 && (
          <div
            className="mt-12 flex flex-wrap items-center gap-2 border-t border-border/70 pt-8"
            aria-label="Tags"
          >
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              Filed under
            </span>
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {(post.prev || post.next) && (
          <nav
            aria-label="Post navigation"
            className="mt-12 grid grid-cols-1 gap-4 border-t border-border/70 pt-8 sm:grid-cols-2"
          >
            {post.prev ? (
              <Link
                to="/blog/$slug"
                params={{ slug: post.prev.slug }}
                className="group flex flex-col gap-2 rounded-xl border border-border/70 p-5 transition-colors hover:border-brand/40"
                aria-label={`Previous post: ${post.prev.title}`}
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                  ← Previous
                </span>
                <span className="line-clamp-2 font-display text-lg font-medium leading-snug transition-colors group-hover:text-brand">
                  {post.prev.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}

            {post.next ? (
              <Link
                to="/blog/$slug"
                params={{ slug: post.next.slug }}
                className="group flex flex-col gap-2 rounded-xl border border-border/70 p-5 transition-colors hover:border-brand/40 sm:items-end sm:text-right"
                aria-label={`Next post: ${post.next.title}`}
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Next →
                </span>
                <span className="line-clamp-2 font-display text-lg font-medium leading-snug transition-colors group-hover:text-brand">
                  {post.next.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
          </nav>
        )}
      </article>
    </>
  )
}
