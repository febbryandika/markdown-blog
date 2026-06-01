import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/client'
import type { InferResponseType } from 'hono/client'

export type AdminPostsResponse = InferResponseType<typeof client.api.admin.posts.$get>
export type AdminPost = AdminPostsResponse[number]

export function useAdminPosts() {
  return useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const res = await client.api.admin.posts.$get()
      if (!res.ok) throw new Error('Failed to fetch posts')
      return res.json()
    },
  })
}
