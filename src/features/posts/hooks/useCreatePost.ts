import { useMutation } from '@tanstack/react-query'

import { createPost } from '../api/createPost'
import { useCreatedPostsStore } from '../state/createdPostsContext'

/**
 * Publishes a post and stores it locally under the `userId` it was submitted for, even if the
 * selection changes while the request is in flight. Never retries (CP-11, mutation default).
 */
export function useCreatePost() {
  const { addPost } = useCreatedPostsStore()

  return useMutation({
    mutationFn: createPost,
    onSuccess: (created, input) => {
      addPost({
        key: `local-${crypto.randomUUID()}`,
        userId: input.userId,
        title: created.title,
        body: created.body,
      })
    },
  })
}
