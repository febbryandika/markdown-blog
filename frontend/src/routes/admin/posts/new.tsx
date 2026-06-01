import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'

export const Route = createFileRoute('/admin/posts/new')({
  component: NewPostPage,
})

function NewPostPage() {
  const [content, setContent] = useState('')

  return (
    <section aria-labelledby="new-post-heading">
      <header className="mb-6">
        <h1 id="new-post-heading" className="text-2xl font-bold tracking-tight">New post</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Write your post in Markdown.</p>
      </header>

      <MarkdownEditor value={content} onChange={setContent} />
    </section>
  )
}
