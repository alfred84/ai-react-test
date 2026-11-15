import { useCallback, useSyncExternalStore } from 'react'

const URL_CHANGE_EVENT = 'app:urlchange'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(URL_CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(URL_CHANGE_EVENT, onChange)
  }
}

/**
 * Reads and writes one query-string parameter, keeping every subscriber in sync
 * (including back/forward navigation). Writes use `replaceState`, so typing a search
 * does not flood the history. Passing `null` or `''` removes the parameter.
 *
 * @returns `[value, setValue]`, where `value` is `null` when the parameter is absent.
 */
export function useSearchParam(name: string): [string | null, (value: string | null) => void] {
  const value = useSyncExternalStore(subscribe, () =>
    new URLSearchParams(window.location.search).get(name),
  )

  // Stable identity: consumers may use the setter as an effect dependency.
  const setValue = useCallback(
    (next: string | null) => {
      const params = new URLSearchParams(window.location.search)
      if (next) params.set(name, next)
      else params.delete(name)
      const query = params.toString()
      const { pathname, hash } = window.location
      window.history.replaceState(null, '', `${pathname}${query ? `?${query}` : ''}${hash}`)
      window.dispatchEvent(new Event(URL_CHANGE_EVENT))
    },
    [name],
  )

  return [value, setValue]
}
