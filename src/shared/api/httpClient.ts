import type { z } from 'zod'

import { ApiError } from './apiError'
import { API_BASE_URL } from './config'

export type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  signal?: AbortSignal
}

/**
 * Performs a JSON request against JSONPlaceholder and validates the response with `schema`.
 * This is the only module allowed to call `fetch`.
 *
 * @param path - Path relative to {@link API_BASE_URL}, e.g. `/users`.
 * @param schema - Zod schema the 2xx body must satisfy; unknown keys are stripped.
 * @returns The parsed, typed body.
 * @throws {@link ApiError} `network` | `http` | `parse` for every failure except aborts.
 * @throws The original abort error when `signal` aborts, so TanStack Query sees a cancellation.
 */
export async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  // Without this header JSONPlaceholder echoes the raw body as a single key.
  if (body !== undefined) headers['Content-Type'] = 'application/json; charset=UTF-8'

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError('network', 'Network request failed', { cause: error })
  }

  // Error bodies may be HTML (observed on the real API), so they are never parsed.
  if (!response.ok) {
    throw new ApiError('http', `Request failed with status ${String(response.status)}`, {
      status: response.status,
    })
  }

  let data: unknown
  try {
    data = await response.json()
  } catch (error) {
    throw new ApiError('parse', 'Response body is not valid JSON', { cause: error })
  }

  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ApiError('parse', 'Response body failed validation', { cause: result.error })
  }
  return result.data
}
