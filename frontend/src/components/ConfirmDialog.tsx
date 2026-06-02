import { useEffect, useRef } from 'react'
import { buttonOutline, buttonDestructive } from '@/lib/ui'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  // Close on native Esc key (dialog fires 'cancel' event)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleCancel = (e: Event) => {
      e.preventDefault()
      onCancel()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onCancel])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="rounded-lg border bg-background p-6 shadow-lg backdrop:bg-black/50 w-full max-w-sm mx-auto"
    >
      <h2 id="confirm-dialog-title" className="text-base font-semibold">
        {title}
      </h2>
      <p
        id="confirm-dialog-desc"
        className="mt-2 text-sm text-muted-foreground"
      >
        {description}
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className={buttonOutline}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={buttonDestructive}
        >
          {loading ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
