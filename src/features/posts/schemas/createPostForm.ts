import { z } from 'zod'

export const createPostFormSchema = z.object({
  title: z.string(),
  body: z.string(),
})
