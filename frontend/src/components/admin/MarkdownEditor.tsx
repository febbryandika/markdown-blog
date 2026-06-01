import type { ChangeEvent } from 'react'
import { usePreview } from '@/hooks/admin-posts'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { PostBody } from '@/components/PostBody'
import { Skeleton } from '@/components/Skeleton'

/** Debounce preview requests to avoid a round-trip on every keystroke (SPEC §10). */
const PREVIEW_DEBOUNCE_MS = 500

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  /** Associates the textarea with an external `<label htmlFor>` when embedded in a form. */
  id?: string
}

/**
 * Controlled Markdown editor. The parent owns the content (`value`/`onChange`);
 * the live preview state stays internal. Preview HTML is rendered server-side
 * (sanitized) via the shared `PostBody`, so it matches published output.
 */
export function MarkdownEditor({ value, onChange, id = 'markdown-content' }: MarkdownEditorProps) {
  const debouncedValue = useDebouncedValue(value, PREVIEW_DEBOUNCE_MS)
  const preview = usePreview(debouncedValue)

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Write pane */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-2">
          <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
            Write
          </label>
        </div>
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder="Write your post in Markdown…"
          spellCheck={false}
          className="min-h-[60vh] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed focus-visible:outline-none"
        />
      </div>

      {/* Preview pane */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">Preview</span>
          {preview.isFetching && preview.data && (
            <span className="text-xs text-muted-foreground">Updating…</span>
          )}
        </div>
        <div className="min-h-[60vh] p-4">
          {preview.isLoading ? (
            <div className="flex flex-col gap-3" aria-hidden="true">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : preview.data ? (
            <PostBody html={preview.data.html} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
