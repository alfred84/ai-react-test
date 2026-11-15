import { useQuery } from '@tanstack/react-query'

import { getUsers } from '../api/getUsers'

export const usersKeys = {
  all: ['users'] as const,
}

/** Server state for the users list (UL-01). */
export function useUsers() {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: ({ signal }) => getUsers(signal),
  })
}
