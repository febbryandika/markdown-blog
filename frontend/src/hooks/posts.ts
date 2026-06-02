import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/client'
import type { InferResponseType } from 'hono/client'

export type PostsResponse = InferResponseType<typeof client.api.posts.$get>
export type PostSummary = PostsResponse['posts'][number]
export type PostDetail = InferResponseType<
  (typeof client.api.posts)[':slug']['$get']
>

export function usePosts({
  page = 1,
  tag,
}: { page?: number; tag?: string } = {}) {
  return useQuery({
    queryKey: ['posts', { page, tag }],
    queryFn: async () => {
      const res = await client.api.posts.$get({
        query: { page: String(page), tag },
      })
      if (!res.ok) throw new Error('Failed to fetch posts')
      return res.json()
    },
  })
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await client.api.posts[':slug'].$get({ param: { slug } })
      if (!res.ok) {
        if (res.status === 404) throw new Error('NOT_FOUND')
        throw new Error('Failed to fetch post')
      }
      return res.json()
    },
    enabled: !!slug,
    // Don't retry 404s — they're not transient
    retry: (_, error) =>
      !(error instanceof Error && error.message === 'NOT_FOUND'),
  })
}
