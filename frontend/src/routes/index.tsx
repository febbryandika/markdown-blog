import { createFileRoute, Link } from '@tanstack/react-router'
import { usePosts, type PostSummary } from '@/hooks/posts'
import { PostCard } from '@/components/PostCard'
import { PostListSkeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { TagBadge } from '@/components/TagBadge'
import { buttonPrimary } from '@/lib/ui'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const query = usePosts({ page: 1 })

  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      <Hero />
      <section aria-labelledby="latest-heading">
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-border/70 pb-4">
          <h2
            id="latest-heading"
            className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Latest writing
          </h2>
          <Link
            to="/blog"
            className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-brand"
          >
            View all →
          </Link>
        </div>
        <LatestWriting query={query} />
      </section>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative isolate pt-6 sm:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-24 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
      />
      <p
        className="animate-fade-up font-mono text-xs uppercase tracking-[0.3em] text-brand"
        style={{ animationDelay: '0ms' }}
      >
        Field Notes
      </p>
      <h1
        className="animate-fade-up mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
        style={{ animationDelay: '80ms' }}
      >
        Notes on building, writing, and the things in between.
      </h1>
      <p
        className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        style={{ animationDelay: '160ms' }}
      >
        Long-form essays and short notes on software, design, and the occasional
        tangent — published whenever there's something worth saying.
      </p>
      <div
        className="animate-fade-up mt-9 flex flex-wrap items-center gap-5"
        style={{ animationDelay: '240ms' }}
      >
        <Link to="/blog" className={buttonPrimary}>
          Read the blog →
        </Link>
      </div>
    </section>
  )
}

function LatestWriting({
  query,
}: {
  query: ReturnType<typeof usePosts>
}) {
  const { data, isLoading, isError, refetch } = query

  if (isLoading) return <PostListSkeleton />

  if (isError) {
    return <ErrorState message="Failed to load posts." onRetry={() => refetch()} />
  }

  if (!data || data.posts.length === 0) {
    return (
      <EmptyState
        message="No posts published yet."
        hint="Once the first post is published, it will appear here."
      />
    )
  }

  const [featured, ...rest] = data.posts
  const recent = rest.slice(0, 3)

  return (
    <div className="flex flex-col gap-12">
      <FeaturedPost post={featured} />
      {recent.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

function FeaturedPost({ post }: { post: PostSummary }) {
  const text = (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand">
        Featured
      </p>
      <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="transition-colors hover:text-brand"
        >
          {post.title}
        </Link>
      </h3>
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        )}
        {post.readingTime != null && (
          <>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </>
        )}
      </div>
      {post.excerpt && (
        <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="mt-1 inline-flex items-center font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:text-brand"
        aria-label={`Read "${post.title}"`}
      >
        Read the story →
      </Link>
    </div>
  )

  if (!post.coverImage) {
    return (
      <article className="border-l-2 border-brand/40 pl-6 sm:pl-8">{text}</article>
    )
  }

  return (
    <article className="group grid items-center gap-6 md:grid-cols-2 md:gap-10">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="block overflow-hidden rounded-xl border"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={post.coverImage}
          alt=""
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      {text}
    </article>
  )
}
