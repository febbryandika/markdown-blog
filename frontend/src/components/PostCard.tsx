import { Link } from '@tanstack/react-router'
import type { PostSummary } from '@/hooks/posts'
import { TagBadge } from './TagBadge'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: PostSummary
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex h-full flex-col gap-4 rounded-xl border border-border/70 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg">
      {post.coverImage && (
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          tabIndex={-1}
          aria-hidden="true"
          className="block overflow-hidden rounded-lg border"
        >
          <img
            src={post.coverImage}
            alt=""
            className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        )}
        {post.readingTime != null && (
          <>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min</span>
          </>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="line-clamp-2 transition-colors hover:text-brand"
        >
          {post.title}
        </Link>
      </h3>

      {post.excerpt && (
        <p className="line-clamp-3 leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  )
}
