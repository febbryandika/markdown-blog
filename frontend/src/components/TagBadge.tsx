import { Link } from '@tanstack/react-router'

interface TagBadgeProps {
  tag: string
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      to="/blog/tag/$tag"
      params={{ tag }}
      className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-accent transition-colors"
    >
      #{tag}
    </Link>
  )
}
