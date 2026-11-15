import { render, screen } from '@testing-library/react'
import { SearchX } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('AS-10 renders title, guidance and an optional action', () => {
    render(
      <EmptyState
        icon={SearchX}
        title="No users found"
        action={<button type="button">Clear</button>}
      >
        Try a different name.
      </EmptyState>,
    )

    expect(screen.getByRole('heading', { name: 'No users found' })).toBeInTheDocument()
    expect(screen.getByText('Try a different name.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
  })

  it('AS-10 renders without an action', () => {
    render(<EmptyState icon={SearchX} title="Nothing here" />)

    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
