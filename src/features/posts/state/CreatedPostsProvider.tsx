import { useMemo, useReducer, type ReactNode } from 'react'

import {
  CreatedPostsContext,
  type CreatedPost,
  type CreatedPostsStore,
} from './createdPostsContext'

type State = CreatedPostsStore['postsByUser']

function reducer(state: State, post: CreatedPost): State {
  return { ...state, [post.userId]: [post, ...(state[post.userId] ?? [])] }
}

export type CreatedPostsProviderProps = {
  children: ReactNode
}

/**
 * Keeps created posts outside the query cache, so refetches and cache garbage collection can
 * never drop them (CP-09). They are lost on reload, like the API's fake persistence.
 */
export function CreatedPostsProvider({ children }: CreatedPostsProviderProps) {
  const [postsByUser, addPost] = useReducer(reducer, {})
  const store = useMemo(() => ({ postsByUser, addPost }), [postsByUser])

  return <CreatedPostsContext value={store}>{children}</CreatedPostsContext>
}
