import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useSearchParam } from './useSearchParam'

describe('useSearchParam', () => {
  it('UL-05 reads the initial value from the URL', () => {
    window.history.replaceState(null, '', '/?q=ervin&user=2')

    const { result } = renderHook(() => useSearchParam('q'))

    expect(result.current[0]).toBe('ervin')
  })

  it('UL-05 writes and removes the parameter, keeping the others', () => {
    window.history.replaceState(null, '', '/?user=2')
    const { result } = renderHook(() => useSearchParam('q'))

    act(() => {
      result.current[1]('clement')
    })
    expect(result.current[0]).toBe('clement')
    expect(window.location.search).toBe('?user=2&q=clement')

    act(() => {
      result.current[1](null)
    })
    expect(result.current[0]).toBeNull()
    expect(window.location.search).toBe('?user=2')
  })

  it('UL-08 keeps every hook instance in sync and follows history navigation', () => {
    window.history.replaceState(null, '', '/')
    const { result: writer } = renderHook(() => useSearchParam('user'))
    const { result: reader } = renderHook(() => useSearchParam('user'))

    act(() => {
      writer.current[1]('3')
    })
    expect(reader.current[0]).toBe('3')

    act(() => {
      window.history.replaceState(null, '', '/?user=7')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(writer.current[0]).toBe('7')
  })
})
