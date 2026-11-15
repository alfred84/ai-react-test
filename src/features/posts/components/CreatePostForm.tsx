import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/Button'

import { useCreatePost } from '../hooks/useCreatePost'
import { createPostFormSchema } from '../schemas/createPostForm'

export type CreatePostFormProps = {
  userId: number
}

const fieldClasses =
  'w-full rounded-lg border bg-canvas px-3 py-2 placeholder:text-fg-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none aria-invalid:border-danger'

/**
 * "New post" form (CP-01..07, CP-10). Errors appear on blur of a touched field and on submit,
 * and focus moves to the first invalid field on a failed submit.
 */
export function CreatePostForm({ userId }: CreatePostFormProps) {
  const id = useId()
  const createPost = useCreatePost()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostFormSchema),
    mode: 'onTouched',
    defaultValues: { title: '', body: '' },
  })

  const onSubmit = handleSubmit((values) => {
    createPost.mutate(
      { ...values, userId },
      {
        onSuccess: () => {
          reset()
        },
      },
    )
  })

  return (
    <form
      aria-labelledby={`${id}-heading`}
      aria-busy={createPost.isPending}
      noValidate
      onSubmit={(event) => void onSubmit(event)}
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted p-4"
    >
      <h3 id={`${id}-heading`} className="font-semibold">
        New post
      </h3>

      <div>
        <label htmlFor={`${id}-title`} className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id={`${id}-title`}
          type="text"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${id}-title-error` : undefined}
          className={`${fieldClasses} border-border`}
          {...register('title')}
        />
        {errors.title && (
          <p id={`${id}-title-error`} className="mt-1 text-sm text-danger">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-body`} className="mb-1 block text-sm font-medium">
          Body
        </label>
        <textarea
          id={`${id}-body`}
          rows={4}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? `${id}-body-error` : undefined}
          className={`${fieldClasses} border-border`}
          {...register('body')}
        />
        {errors.body && (
          <p id={`${id}-body-error`} className="mt-1 text-sm text-danger">
            {errors.body.message}
          </p>
        )}
      </div>

      {createPost.isError && (
        <p role="alert" className="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">
          We couldn&apos;t publish your post. Please try again.
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={createPost.isPending}>
          {createPost.isPending ? 'Publishing…' : 'Publish'}
        </Button>
        <p role="status" className="text-sm text-success">
          {createPost.isSuccess ? 'Post published' : ''}
        </p>
      </div>
    </form>
  )
}
