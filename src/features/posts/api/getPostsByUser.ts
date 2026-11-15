import { request } from '@/shared/api/httpClient'

import { postsSchema, type Post } from '../schemas/post'

/**
 * `GET /posts?userId=<id>` (API-02). An unknown id answers `200 []`, not 404.
 *
 * @param signal Aborts the request when the selection changes (UP-06).
 */
export function getPostsByUser(userId: number, signal?: AbortSignal): Promise<Post[]> {
  return request(`/posts?userId=${String(userId)}`, postsSchema, { signal })
}
