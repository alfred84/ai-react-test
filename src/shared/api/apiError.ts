/**
 * Failure categories of an API call:
 * - `network`: `fetch` rejected (offline, DNS, CORS), excluding aborts.
 * - `http`: the server answered with a non-2xx status.
 * - `parse`: the body was not JSON or did not match the expected schema.
 */
export type ApiErrorKind = 'network' | 'http' | 'parse'

type ApiErrorOptions = {
  status?: number
  cause?: unknown
}

/** Typed error thrown by the API client for every non-abort failure. */
export class ApiError extends Error {
  override readonly name = 'ApiError'
  readonly kind: ApiErrorKind
  /** HTTP status, only for `kind: 'http'`. */
  readonly status: number | undefined

  constructor(kind: ApiErrorKind, message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.kind = kind
    this.status = options.status
  }
}
