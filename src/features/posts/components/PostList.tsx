export type ListedPost = {
  /** `server-<id>` or `local-<uuid>`, so created posts never collide with server ones. */
  key: string
  title: string
  body: string
  isNew: boolean
}

export type PostListProps = {
  posts: ListedPost[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {posts.map((post) => (
        <li key={post.key}>
          <article className="rounded-lg border border-border bg-canvas p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold first-letter:uppercase">{post.title}</h3>
              {post.isNew && (
                <span className="shrink-0 rounded-full bg-success-subtle px-2 py-0.5 text-xs font-medium text-success">
                  New
                </span>
              )}
            </div>
            <p className="mt-2 text-sm whitespace-pre-line text-fg-muted">{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}
