interface PostBodyProps {
  html: string
}

export function PostBody({ html }: PostBodyProps) {
  return (
    <div
      // Colors/typography come from the editorial `.prose` overrides in index.css,
      // which are theme-token driven, so no prose-slate / dark:prose-invert needed.
      className="prose max-w-none"
      // HTML is server-sanitized via rehype-sanitize before reaching the client
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
