import { z } from 'zod'

/** A JSONPlaceholder post (specs/api-contract.md, API-02). The text field is `body`. */
export const postSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string(),
  body: z.string(),
})

export const postsSchema = z.array(postSchema)

export type Post = z.infer<typeof postSchema>
