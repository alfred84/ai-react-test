import { useSearchParam } from './useSearchParam'

/**
 * The selected user, stored in `?user=<id>` so it survives reloads and can be shared.
 * Non-numeric values are treated as "no selection".
 *
 * @returns `[selectedUserId, selectUser]`
 */
export function useSelectedUserId(): [number | null, (userId: number) => void] {
  const [raw, setRaw] = useSearchParam('user')
  const selectedUserId = /^\d+$/.test(raw ?? '') ? Number(raw) : null

  return [
    selectedUserId,
    (userId) => {
      setRaw(String(userId))
    },
  ]
}
