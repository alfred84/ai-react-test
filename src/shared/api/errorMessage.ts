import { ApiError } from './apiError'

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'

/** Maps any thrown value to a friendly, user-facing message (AS-06). */
export function getErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return FALLBACK_MESSAGE

  switch (error.kind) {
    case 'network':
      return "We couldn't reach the server. Check your connection and try again."
    case 'http':
      return `The server responded with an error (status ${String(error.status)}). Please try again.`
    case 'parse':
      return 'We received unexpected data from the server. Please try again.'
  }
}
