import { cn } from '@/lib/utils'

// Shared styling for text inputs, selects and textareas.
export const inputClasses = cn(
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  'focus:outline-none focus:ring-2 focus:ring-ring',
  'disabled:opacity-50 disabled:cursor-not-allowed',
)

// Shared button base + variants (default px-4 py-2 size).
export const buttonBase = cn(
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
  'disabled:opacity-50 disabled:cursor-not-allowed',
)

export const buttonPrimary = cn(
  buttonBase,
  'bg-primary text-primary-foreground hover:bg-primary/90',
)
export const buttonOutline = cn(buttonBase, 'border hover:bg-accent')
export const buttonDestructive = cn(
  buttonBase,
  'bg-destructive text-destructive-foreground hover:bg-destructive/90',
)
