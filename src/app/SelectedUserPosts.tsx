import { UserX } from 'lucide-react'
import { useId } from 'react'

import { PostsPanel } from '@/features/posts/components/PostsPanel'
import { useUsers } from '@/features/users/hooks/useUsers'
import { useSelectedUserId } from '@/shared/lib/useSelectedUserId'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

/**
 * Resolves `?user=<id>` against the users list and renders its posts (UP-07).
 * Renders nothing while the users are not loaded: the heading needs the user's name.
 */
export function SelectedUserPosts() {
  const headingId = useId()
  const [selectedUserId, selectUser] = useSelectedUserId()
  const usersQuery = useUsers()

  if (selectedUserId === null) return <PostsPanel user={null} />
  if (!usersQuery.isSuccess) return null

  const goBack = () => {
    selectUser(null)
  }
  const user = usersQuery.data.find(({ id }) => id === selectedUserId)

  if (!user) {
    return (
      <section
        aria-labelledby={headingId}
        className="rounded-card border border-border bg-surface p-4"
      >
        <h2 id={headingId} className="sr-only">
          Posts
        </h2>
        <EmptyState
          icon={UserX}
          title="User not found"
          action={
            <Button variant="secondary" onClick={goBack}>
              Back to users
            </Button>
          }
        >
          There is no user with id {selectedUserId}.
        </EmptyState>
      </section>
    )
  }

  return <PostsPanel user={user} onBack={goBack} />
}
