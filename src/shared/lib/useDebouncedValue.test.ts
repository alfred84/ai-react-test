import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('UL-04 updates only after the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 250), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => {
      vi.advanceTimersByTime(249)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('ab')
  })

  it('UL-04 restarts the delay on every change', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 250), {
      initialProps: { value: 'l' },
    })

    rerender({ value: 'le' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    rerender({ value: 'lea' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('l')

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe('lea')
  })
})
