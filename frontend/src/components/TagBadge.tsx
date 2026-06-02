import { Link } from '@tanstack/react-router'

interface TagBadgeProps {
  tag: string
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      to="/blog/tag/$tag"
      params={{ tag }}
      className="inline-flex items-center rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
    >
      {tag}
    </Link>
  )
}
