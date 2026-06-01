import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.admin.posts[':id'].$delete({ param: { id } })
      if (!res.ok) throw new Error('Failed to delete post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
    },
  })
}
