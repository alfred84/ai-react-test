import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AppErrorBoundary } from './AppErrorBoundary'

function Broken(): never {
  throw new Error('render failure')
}

describe('AppErrorBoundary', () => {
  it('AS-11 renders a fallback for render errors', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <AppErrorBoundary>
        <Broken />
      </AppErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reload page' })).toHaveAttribute(
      'href',
      window.location.href,
    )
    expect(consoleError).toHaveBeenCalled()
  })

  it('AS-11 renders children when nothing throws', () => {
    render(
      <AppErrorBoundary>
        <p>All good</p>
      </AppErrorBoundary>,
    )

    expect(screen.getByText('All good')).toBeInTheDocument()
  })
})
