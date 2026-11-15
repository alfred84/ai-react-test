import { request } from '@/shared/api/httpClient'

import { usersSchema, type User } from '../schemas/user'

/** `GET /users` (API-01): all 10 users, validated. */
export function getUsers(signal?: AbortSignal): Promise<User[]> {
  return request('/users', usersSchema, { signal })
}
