import type { ChangeEvent } from 'react'
import { usePreview } from '@/hooks/admin-posts'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { PostBody } from '@/components/PostBody'
import { Skeleton } from '@/components/Skeleton'
import { ErrorState } from '@/components/ErrorState'

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
  const hasPreviewContent = debouncedValue.trim().length > 0

  // Announced to screen readers via a polite live region (visual cues are separate).
  const previewStatus = !hasPreviewContent
    ? ''
    : preview.isError
      ? 'Preview failed to load.'
      : preview.isFetching
        ? 'Loading preview…'
        : preview.data
          ? 'Preview updated.'
          : ''

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value)
  }

  function handleRetryPreview() {
    preview.refetch()
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Write pane — focus-within rings the pane when the textarea has focus */}
        <div className="rounded-lg border bg-card focus-within:ring-2 focus-within:ring-ring">
          <div className="border-b px-4 py-2">
            <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
              Write
            </label>
          </div>
          {/* Tab intentionally moves focus out of the textarea (no tab-trap) for keyboard users. */}
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
              <span className="text-xs text-muted-foreground" aria-hidden="true">Updating…</span>
            )}
          </div>
          <div className="min-h-[60vh] p-4" aria-busy={preview.isFetching}>
            {!hasPreviewContent ? (
              <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
            ) : preview.isError ? (
              <ErrorState message="Couldn't render the preview." onRetry={handleRetryPreview} />
            ) : preview.isLoading ? (
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

      {/* Polite status updates for screen readers */}
      <p role="status" aria-live="polite" className="sr-only">{previewStatus}</p>
    </>
  )
}
