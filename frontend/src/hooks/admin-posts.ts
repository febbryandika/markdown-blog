import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/client'
import type { InferRequestType, InferResponseType } from 'hono/client'

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
    // Surface failures promptly; recovery is via the explicit retry button.
    retry: false,
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

/** Pull the API's structured error message ({ error: { message } }) for inline display. */
async function getErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: { message?: string } }
    return body.error?.message ?? fallback
  } catch {
    return fallback
  }
}

export function useCategories() {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await client.api.admin.categories.$get()
      if (!res.ok) throw new Error('Failed to load categories')
      return res.json()
    },
  })
}

/** Single post, loaded into the edit form. */
export function useAdminPost(id: string) {
  return useQuery({
    queryKey: ['admin-post', id],
    queryFn: async () => {
      const res = await client.api.admin.posts[':id'].$get({ param: { id } })
      if (!res.ok) throw new Error('Failed to load post')
      return res.json()
    },
  })
}

type CreatePostInput = InferRequestType<typeof client.api.admin.posts.$post>['json']

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const res = await client.api.admin.posts.$post({ json: input })
      if (!res.ok) throw new Error(await getErrorMessage(res, 'Failed to create post'))
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
    },
  })
}

type UpdatePostInput = InferRequestType<(typeof client.api.admin.posts)[':id']['$put']>['json']

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdatePostInput) => {
      const res = await client.api.admin.posts[':id'].$put({ param: { id }, json: input })
      if (!res.ok) throw new Error(await getErrorMessage(res, 'Failed to update post'))
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-post', id] })
    },
  })
}
