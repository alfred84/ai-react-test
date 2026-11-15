import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCreatedPostsStore } from './createdPostsContext'

describe('useCreatedPostsStore', () => {
  it('throws a clear error outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() => renderHook(() => useCreatedPostsStore())).toThrow(
      'useCreatedPostsStore must be used within CreatedPostsProvider',
    )
  })
})
