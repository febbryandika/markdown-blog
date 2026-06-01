interface PostBodyProps {
  html: string
}

export function PostBody({ html }: PostBodyProps) {
  return (
    <div
      className="prose prose-slate max-w-none dark:prose-invert"
      // HTML is server-sanitized via rehype-sanitize before reaching the client
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
