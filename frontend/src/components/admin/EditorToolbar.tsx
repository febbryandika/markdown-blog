import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type EditorView = 'write' | 'preview'

const VIEWS: { value: EditorView; label: string }[] = [
  { value: 'write', label: 'Write' },
  { value: 'preview', label: 'Preview' },
]

interface EditorToolbarProps {
  /** Active pane on mobile; the toggle is hidden at lg+ where both panes show. */
  view: EditorView
  onViewChange: (view: EditorView) => void
  /** Slot for future editor actions (e.g. formatting buttons), shown at all breakpoints. */
  children?: ReactNode
}

/** Editor toolbar: a mobile Write/Preview view switch plus a slot for future actions. */
export function EditorToolbar({ view, onViewChange, children }: EditorToolbarProps) {
  return (
    <div
      className={cn(
        'mb-3 items-center justify-between gap-2',
        // With actions, stay visible on desktop; otherwise the bar exists only for the mobile toggle.
        children ? 'flex' : 'flex lg:hidden',
      )}
    >
      <div className="flex gap-1 lg:hidden" role="group" aria-label="Editor view">
        {VIEWS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onViewChange(value)}
            aria-pressed={view === value}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              view === value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {children && <div className="flex items-center gap-1">{children}</div>}
    </div>
  )
}
