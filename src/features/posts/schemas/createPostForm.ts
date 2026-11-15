import { z } from 'zod'

/** Client-side validation for the create form; the API validates nothing (CP-02, CP-03). */
export const createPostFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer'),
  body: z
    .string()
    .trim()
    .min(1, 'Body is required')
    .max(1000, 'Body must be 1000 characters or fewer'),
})

export type CreatePostFormValues = z.output<typeof createPostFormSchema>
