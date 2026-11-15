import { ArrowLeft, MousePointerClick, NotebookPen } from 'lucide-react'
import { useId } from 'react'

import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Skeleton } from '@/shared/ui/Skeleton'

import { usePosts } from '../hooks/usePosts'
import { useCreatedPostsStore } from '../state/createdPostsContext'
import { CreatePostForm } from './CreatePostForm'
import { PostList, type ListedPost } from './PostList'

export type PostsAuthor = { id: number; name: string }

export type PostsPanelProps = {
  user: PostsAuthor | null
  /** Clears the selection; rendered as "Back to users" on small screens (UP-08). */
  onBack?: () => void
}

const panelClasses = 'flex flex-col gap-4 rounded-card border border-border bg-surface p-4'

/**
 * Detail side of the master-detail layout: the create form and the selected user's posts,
 * created ones first (UP-01..05, CP-07).
 */
export function PostsPanel({ user, onBack }: PostsPanelProps) {
  const headingId = useId()

  if (!user) {
    return (
      <section aria-labelledby={headingId} className={panelClasses}>
        <h2 id={headingId} className="text-lg font-semibold">
          Posts
        </h2>
        <EmptyState icon={MousePointerClick} title="Select a user to see their posts">
          Choose someone from the users list.
        </EmptyState>
      </section>
    )
  }

  return <UserPosts user={user} onBack={onBack} />
}

function UserPosts({ user, onBack }: { user: PostsAuthor; onBack?: (() => void) | undefined }) {
  const headingId = useId()
  const postsQuery = usePosts(user.id)
  const createdPosts = useCreatedPostsStore().postsByUser[user.id] ?? []
  const posts: ListedPost[] = [
    ...createdPosts.map(({ key, title, body }) => ({ key, title, body, isNew: true })),
    ...(postsQuery.data ?? []).map(({ id, title, body }) => ({
      key: `server-${String(id)}`,
      title,
      body,
      isNew: false,
    })),
  ]

  return (
    <section aria-labelledby={headingId} aria-busy={postsQuery.isPending} className={panelClasses}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={headingId} className="text-lg font-semibold">
          Posts by {user.name}
        </h2>
        {onBack && (
          <Button variant="secondary" className="md:hidden" onClick={onBack}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to users
          </Button>
        )}
      </div>

      <CreatePostForm key={user.id} userId={user.id} />

      <p role="status" className="sr-only">
        {postsQuery.isPending ? 'Loading posts…' : ''}
      </p>

      {postsQuery.isPending && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-lg border border-border p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      )}

      {postsQuery.isError && (
        <ErrorState
          title="Couldn't load posts"
          error={postsQuery.error}
          onRetry={() => {
            void postsQuery.refetch()
          }}
        />
      )}

      {postsQuery.isSuccess &&
        (posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <EmptyState icon={NotebookPen} title={`${user.name} hasn't posted yet`}>
            Write their first post with the form above.
          </EmptyState>
        ))}
    </section>
  )
}
