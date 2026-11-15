import type { Post } from '../schemas/post'

export type PostListProps = {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {posts.map((post) => (
        <li key={`server-${String(post.id)}`}>
          <article className="rounded-lg border border-border bg-canvas p-4">
            <h3 className="font-semibold first-letter:uppercase">{post.title}</h3>
            <p className="mt-2 text-sm whitespace-pre-line text-fg-muted">{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}
