import { z } from 'zod'

/**
 * The fields of a JSONPlaceholder user the app uses (specs/api-contract.md, API-01).
 * `address`, `phone`, `website` and `company` are stripped. `email` is only checked as a
 * string: display data is not the place to enforce email syntax.
 */
export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  username: z.string(),
  email: z.string(),
})

export const usersSchema = z.array(userSchema)

export type User = z.infer<typeof userSchema>
