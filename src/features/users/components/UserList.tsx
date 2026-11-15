import { Avatar } from '@/shared/ui/Avatar'

import type { User } from '../schemas/user'

export type UserListProps = {
  users: User[]
  selectedUserId: number | null
  onSelect: (userId: number) => void
}

export function UserList({ users, selectedUserId, onSelect }: UserListProps) {
  return (
    <ul aria-label="Users" className="flex flex-col gap-1">
      {users.map((user) => {
        const isSelected = user.id === selectedUserId
        return (
          <li key={user.id}>
            <button
              type="button"
              aria-current={isSelected ? 'true' : undefined}
              onClick={() => {
                onSelect(user.id)
              }}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none motion-safe:transition-colors ${
                isSelected
                  ? 'border-accent bg-accent-subtle'
                  : 'border-transparent hover:bg-surface-muted'
              }`}
            >
              <Avatar name={user.name} />
              <span className="min-w-0">
                <span className="block truncate font-medium">{user.name}</span>
                <span className="block truncate text-sm text-fg-muted">{user.email}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
