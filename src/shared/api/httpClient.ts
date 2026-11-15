import type { z } from 'zod'

export type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  signal?: AbortSignal
}

export function request<T>(
  _path: string,
  _schema: z.ZodType<T>,
  _options: RequestOptions = {},
): Promise<T> {
  return Promise.reject(new Error('Not implemented'))
}
