import { QueryClient } from '@tanstack/react-query'

import { ApiError } from '@/shared/api/apiError'

const MAX_RETRIES = 2

/**
 * Retries only failures that may be transient: network errors and 5xx responses, at most twice.
 * 4xx, invalid payloads and unknown (programming) errors fail immediately.
 */
function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (!(error instanceof ApiError) || failureCount >= MAX_RETRIES) return false
  if (error.kind === 'network') return true
  return error.kind === 'http' && error.status !== undefined && error.status >= 500
}

/**
 * Creates the app's QueryClient (AS-07).
 *
 * `staleTime` is 5 minutes: JSONPlaceholder data never changes (it sends `max-age=43200`), so
 * revisiting a user reuses cached posts. Mutations never retry because `POST` is not idempotent.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
      mutations: { retry: false },
    },
  })
}
