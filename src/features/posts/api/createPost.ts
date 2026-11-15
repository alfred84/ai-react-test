import { request } from '@/shared/api/httpClient'

import { postSchema, type Post } from '../schemas/post'

export type CreatePostInput = Pick<Post, 'title' | 'body' | 'userId'>

/**
 * `POST /posts` (API-03). The API echoes the body with `id: 101` every time and persists
 * nothing, so callers must not use the returned `id` as an identity.
 */
export function createPost(input: CreatePostInput): Promise<Post> {
  return request('/posts', postSchema, { method: 'POST', body: input })
}
