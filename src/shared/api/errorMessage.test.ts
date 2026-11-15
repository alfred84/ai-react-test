import { describe, expect, it } from 'vitest'

import { ApiError } from './apiError'
import { getErrorMessage } from './errorMessage'

describe('getErrorMessage', () => {
  it.each([
    [
      new ApiError('network', 'x'),
      "We couldn't reach the server. Check your connection and try again.",
    ],
    [
      new ApiError('http', 'x', { status: 503 }),
      'The server responded with an error (status 503). Please try again.',
    ],
    [new ApiError('parse', 'x'), 'We received unexpected data from the server. Please try again.'],
    [new Error('boom'), 'Something went wrong. Please try again.'],
    ['not an error', 'Something went wrong. Please try again.'],
  ])('AS-06 maps each error kind to a user message (%#)', (error, expected) => {
    expect(getErrorMessage(error)).toBe(expected)
  })
})
