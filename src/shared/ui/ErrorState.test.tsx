import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/apiError'

import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('AS-09 shows the title, the mapped message and calls retry', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <ErrorState
        title="Couldn't load users"
        error={new ApiError('http', 'x', { status: 500 })}
        onRetry={onRetry}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(screen.getByRole('heading', { name: "Couldn't load users" })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'The server responded with an error (status 500). Please try again.',
    )
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
