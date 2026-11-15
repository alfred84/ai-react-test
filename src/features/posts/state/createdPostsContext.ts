import { createContext, use } from 'react'

/** A post created in this session. `key` is `local-<uuid>`, never the server's `id: 101` (CP-08). */
export type CreatedPost = {
  key: `local-${string}`
  userId: number
  title: string
  body: string
}

export type CreatedPostsStore = {
  /** Created posts per user id, newest first. */
  postsByUser: Partial<Record<number, CreatedPost[]>>
  addPost: (post: CreatedPost) => void
}

export const CreatedPostsContext = createContext<CreatedPostsStore | null>(null)

/** Session store for locally created posts (specs/architecture.md#created-posts). */
export function useCreatedPostsStore(): CreatedPostsStore {
  const store = use(CreatedPostsContext)
  if (!store) throw new Error('useCreatedPostsStore must be used within CreatedPostsProvider')
  return store
}
