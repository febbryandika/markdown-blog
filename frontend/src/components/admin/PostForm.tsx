import { useState } from 'react'
import { FormField } from '@/components/FormField'
import { FormError } from '@/components/FormError'
import { SubmitButton } from '@/components/SubmitButton'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { useCategories } from '@/hooks/admin-posts'
import { postFormSchema, type PostFormValues } from '@/lib/post-schema'
import { cn, slugify } from '@/lib/utils'
import { inputClasses } from '@/lib/ui'

type FieldErrors = Partial<Record<keyof PostFormValues, string[]>>

const EMPTY_VALUES: PostFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  categoryId: '',
  tags: [],
}

interface PostFormProps {
  initialValues?: Partial<PostFormValues>
  submitting: boolean
  submitError?: string | null
  submitLabel: string
  submittingLabel: string
  onSubmit: (values: PostFormValues) => void
}

export function PostForm({
  initialValues,
  submitting,
  submitError,
  submitLabel,
  submittingLabel,
  onSubmit,
}: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>({ ...EMPTY_VALUES, ...initialValues })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  // Keep an existing post's slug stable; only auto-fill from the title for brand-new posts.
  const [slugLocked, setSlugLocked] = useState(Boolean(initialValues?.slug))
  const [tagDraft, setTagDraft] = useState('')

  const categories = useCategories()

  // Clear a field's validation error as soon as the user edits it (errors otherwise
  // linger until the next submit).
  function clearError(key: keyof PostFormValues) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function setField<K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    clearError(key)
  }

  function handleTitleChange(title: string) {
    setValues((prev) => ({ ...prev, title, slug: slugLocked ? prev.slug : slugify(title) }))
    clearError('title')
    if (!slugLocked) clearError('slug')
  }

  function handleSlugChange(slug: string) {
    setSlugLocked(true)
    setField('slug', slug)
  }

  function addTag(raw: string) {
    const tag = raw.trim()
    if (!tag) return
    setValues((prev) => (prev.tags.includes(tag) ? prev : { ...prev, tags: [...prev.tags, tag] }))
    setTagDraft('')
  }

  function removeTag(tag: string) {
    setField('tags', values.tags.filter((t) => t !== tag))
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagDraft)
    } else if (e.key === 'Backspace' && tagDraft === '' && values.tags.length > 0) {
      removeTag(values.tags[values.tags.length - 1])
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = postFormSchema.safeParse(values)
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors)
      return
    }
    setFieldErrors({})
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-busy={submitting}>
      <fieldset disabled={submitting} className="space-y-6 border-0 p-0 disabled:opacity-70">
        <legend className="sr-only">Post details</legend>

        <FormField
          id="title"
          label="Title"
          value={values.title}
          onChange={handleTitleChange}
          placeholder="My first post"
          error={fieldErrors.title?.[0]}
        />

        <div className="space-y-1.5">
          <FormField
            id="slug"
            label="Slug"
            value={values.slug}
            onChange={handleSlugChange}
            placeholder="my-first-post"
            error={fieldErrors.slug?.[0]}
          />
          <p className="text-xs text-muted-foreground">
            Used in the post URL. Auto-generated from the title until you edit it.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="excerpt" className="text-sm font-medium">Excerpt</label>
          <textarea
            id="excerpt"
            value={values.excerpt}
            onChange={(e) => setField('excerpt', e.target.value)}
            rows={3}
            placeholder="A short summary of the post."
            aria-describedby="excerpt-hint"
            className={cn(inputClasses, 'resize-y')}
          />
          <p id="excerpt-hint" className="text-xs text-muted-foreground">
            Optional. Shown in post listings and the RSS feed.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
          <select
            id="categoryId"
            value={values.categoryId}
            onChange={(e) => setField('categoryId', e.target.value)}
            className={inputClasses}
          >
            <option value="">None</option>
            {categories.data?.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {categories.isError && (
            <p className="text-xs text-muted-foreground">Couldn’t load categories.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="tags" className="text-sm font-medium">Tags</label>
          {values.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Selected tags">
              {values.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                      className="rounded-full px-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <input
            id="tags"
            type="text"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag"
            aria-describedby="tags-hint"
            className={inputClasses}
          />
          <p id="tags-hint" className="text-xs text-muted-foreground">
            Press Enter or comma to add a tag.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={values.status === 'published'}
              onChange={(e) => setField('status', e.target.checked ? 'published' : 'draft')}
              aria-describedby="published-hint"
              className="h-4 w-4 rounded border-input text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <label htmlFor="published" className="text-sm font-medium">Published</label>
          </div>
          <p id="published-hint" className="text-xs text-muted-foreground">
            When unchecked, the post is saved as a draft.
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-sm font-medium">Content</span>
          <MarkdownEditor value={values.content} onChange={(v) => setField('content', v)} id="content" />
        </div>
      </fieldset>

      {submitError && <FormError message={submitError} />}

      <SubmitButton loading={submitting} label={submitLabel} loadingLabel={submittingLabel} />
    </form>
  )
}
