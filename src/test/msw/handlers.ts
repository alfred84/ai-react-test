import { http, HttpResponse, type RequestHandler } from 'msw'

import { API_BASE_URL } from '@/shared/api/config'
import createPostResponse from '@/test/fixtures/create-post-response.json'
import postsUser1 from '@/test/fixtures/posts-user-1.json'
import postsUser2 from '@/test/fixtures/posts-user-2.json'
import users from '@/test/fixtures/users.json'

const postsByUser: Record<string, unknown[]> = { '1': postsUser1, '2': postsUser2 }

/**
 * Default happy-path handlers serving real API fixtures (specs/api-contract.md).
 * Like the real API, unknown user ids get `200 []` and POST always answers `id: 101`.
 */
export const handlers: RequestHandler[] = [
  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(users)),
  http.get(`${API_BASE_URL}/posts`, ({ request }) => {
    const userId = new URL(request.url).searchParams.get('userId') ?? ''
    return HttpResponse.json(postsByUser[userId] ?? [])
  }),
  http.post(`${API_BASE_URL}/posts`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ ...body, id: createPostResponse.id }, { status: 201 })
  }),
]
