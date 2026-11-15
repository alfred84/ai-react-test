import { SearchX } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { normalizeText } from '@/shared/lib/normalizeText'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
import { useSearchParam } from '@/shared/lib/useSearchParam'
import { useSelectedUserId } from '@/shared/lib/useSelectedUserId'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Skeleton } from '@/shared/ui/Skeleton'

import { useUsers } from '../hooks/useUsers'
import { UserList } from './UserList'

const SEARCH_DEBOUNCE_MS = 250

/** Users list with debounced, accent-insensitive search and selection (UL-01..09). */
export function UsersPanel() {
  const headingId = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  const usersQuery = useUsers()
  const [selectedUserId, selectUser] = useSelectedUserId()

  const [urlQuery, setUrlQuery] = useSearchParam('q')
  const [query, setQuery] = useState(() => urlQuery ?? '')
  const appliedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS).trim()

  useEffect(() => {
    setUrlQuery(appliedQuery || null)
  }, [appliedQuery, setUrlQuery])

  const needle = normalizeText(appliedQuery)
  const visibleUsers = needle
    ? (usersQuery.data ?? []).filter((user) => normalizeText(user.name).includes(needle))
    : (usersQuery.data ?? [])

  let status = ''
  if (usersQuery.isPending) status = 'Loading users…'
  else if (usersQuery.isSuccess)
    status = `${String(visibleUsers.length)} ${visibleUsers.length === 1 ? 'user' : 'users'}`

  return (
    <section
      aria-labelledby={headingId}
      aria-busy={usersQuery.isPending}
      className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4"
    >
      <h2 id={headingId} className="text-lg font-semibold">
        Users
      </h2>

      <div role="search">
        <label htmlFor={`${headingId}-search`} className="mb-1 block text-sm font-medium">
          Search users by name
        </label>
        <input
          ref={searchRef}
          id={`${headingId}-search`}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
          }}
          placeholder="e.g. Leanne"
          className="w-full rounded-lg border border-border bg-canvas px-3 py-2 placeholder:text-fg-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        />
      </div>

      <p role="status" className="text-sm text-fg-muted">
        {status}
      </p>

      {usersQuery.isPending && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {usersQuery.isError && (
        <ErrorState
          title="Couldn't load users"
          error={usersQuery.error}
          onRetry={() => {
            void usersQuery.refetch()
          }}
        />
      )}

      {usersQuery.isSuccess &&
        (visibleUsers.length > 0 ? (
          <UserList users={visibleUsers} selectedUserId={selectedUserId} onSelect={selectUser} />
        ) : (
          <EmptyState
            icon={SearchX}
            title={`No users match "${appliedQuery}"`}
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  searchRef.current?.focus()
                }}
              >
                Clear search
              </Button>
            }
          >
            Check the spelling or try a shorter part of the name.
          </EmptyState>
        ))}
    </section>
  )
}
