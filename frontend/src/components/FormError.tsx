interface FormErrorProps {
  message: string
}

export function FormError({ message }: FormErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
    >
      {message}
    </div>
  )
}
