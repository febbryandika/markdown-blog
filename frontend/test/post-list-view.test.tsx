import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { UseQueryResult } from '@tanstack/react-query'
import { PostListView } from '@/components/PostListView'
import type { PostsResponse } from '@/hooks/posts'

// A query frozen in its loading state — enough for PostListView to branch.
const loadingQuery = {
  isLoading: true,
  isError: false,
  data: undefined,
} as unknown as UseQueryResult<PostsResponse>

describe('PostListView', () => {
  it('renders the loading skeleton while the query is loading', () => {
    render(
      <PostListView
        query={loadingQuery}
        page={1}
        to="/blog/"
        emptyMessage="No posts published yet."
      />,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading posts…')).toBeInTheDocument()
  })
})
