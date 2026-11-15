import { useSearchParam } from './useSearchParam'

/**
 * The selected user, stored in `?user=<id>` so it survives reloads and can be shared.
 * Non-numeric values are treated as "no selection" (UP-07).
 *
 * @returns `[selectedUserId, selectUser]`; `selectUser(null)` clears the selection.
 */
export function useSelectedUserId(): [number | null, (userId: number | null) => void] {
  const [raw, setRaw] = useSearchParam('user')
  const selectedUserId = /^\d+$/.test(raw ?? '') ? Number(raw) : null

  return [
    selectedUserId,
    (userId) => {
      setRaw(userId === null ? null : String(userId))
    },
  ]
}
