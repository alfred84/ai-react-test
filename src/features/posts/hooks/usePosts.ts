import { useQuery } from '@tanstack/react-query'

import { getPostsByUser } from '../api/getPostsByUser'

export const postsKeys = {
  all: ['posts'] as const,
  byUser: (userId: number) => [...postsKeys.all, 'byUser', userId] as const,
}

/**
 * Server posts of one user. Passing the query `signal` lets TanStack Query abort the request
 * when the user switches before it resolves (UP-06); cached posts render instantly (UP-09).
 */
export function usePosts(userId: number) {
  return useQuery({
    queryKey: postsKeys.byUser(userId),
    queryFn: ({ signal }) => getPostsByUser(userId, signal),
  })
}
