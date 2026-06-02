import { Link } from '@tanstack/react-router'
import type { PostSummary } from '@/hooks/posts'
import { TagBadge } from './TagBadge'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: PostSummary
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-card p-5 hover:shadow-sm transition-shadow">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt=""
          className="w-full h-48 object-cover rounded-md"
        />
      )}

      <div className="flex flex-col gap-1">
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="text-lg font-semibold leading-snug hover:text-primary transition-colors line-clamp-2"
        >
          {post.title}
        </Link>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
      </div>

      {post.excerpt && (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  )
}
