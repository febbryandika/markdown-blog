import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

export function usePreview(content: string) {
  return useQuery({
    queryKey: ['preview', content],
    queryFn: async () => {
      const res = await client.api.admin.posts.preview.$post({ json: { content } })
      if (!res.ok) throw new Error('Failed to render preview')
      return res.json()
    },
    // Skip empty content; preview HTML for a given input is deterministic, so cache it forever.
    enabled: content.trim().length > 0,
    staleTime: Infinity,
    // Keep the last preview visible while the next one loads — no flicker between keystrokes.
    placeholderData: keepPreviousData,
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['admin-posts'] })
      const snapshot = queryClient.getQueryData<AdminPostsResponse>(['admin-posts'])
      queryClient.setQueryData<AdminPostsResponse>(
        ['admin-posts'],
        (prev) => prev?.filter((p) => p.id !== id) ?? [],
      )
      return { snapshot }
    },
    onError: (_err, _id, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(['admin-posts'], context.snapshot)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
    },
  })
}
