import type { ChangeEvent } from 'react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  /** Associates the textarea with an external `<label htmlFor>` when embedded in a form. */
  id?: string
}

/**
 * Controlled Markdown editor. The parent owns the content (`value`/`onChange`);
 * preview state stays internal (added in later tasks).
 */
export function MarkdownEditor({ value, onChange, id = 'markdown-content' }: MarkdownEditorProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value)
  }

  return (
    <div className="rounded-lg border bg-card">
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        aria-label="Markdown content"
        placeholder="Write your post in Markdown…"
        className="min-h-[60vh] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed focus-visible:outline-none"
      />
    </div>
  )
}
