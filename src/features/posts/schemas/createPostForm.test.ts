import { describe, expect, it } from 'vitest'

import { createPostFormSchema } from './createPostForm'

function errorsFor(input: { title: string; body: string }) {
  const result = createPostFormSchema.safeParse(input)
  return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe('createPostFormSchema', () => {
  it('CP-02 rejects empty and whitespace-only values', () => {
    expect(errorsFor({ title: '', body: '' })).toEqual(['Title is required', 'Body is required'])
    expect(errorsFor({ title: '   ', body: '\n\t ' })).toEqual([
      'Title is required',
      'Body is required',
    ])
  })

  it('CP-03 enforces max lengths after trimming', () => {
    expect(errorsFor({ title: 'a'.repeat(101), body: 'b'.repeat(1001) })).toEqual([
      'Title must be 100 characters or fewer',
      'Body must be 1000 characters or fewer',
    ])
    expect(errorsFor({ title: ` ${'a'.repeat(100)} `, body: ` ${'b'.repeat(1000)} ` })).toEqual([])
  })

  it('CP-05 outputs trimmed values', () => {
    expect(createPostFormSchema.parse({ title: ' Hello ', body: '\nWorld\n' })).toEqual({
      title: 'Hello',
      body: 'World',
    })
  })
})
