import { screen } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { API_BASE_URL } from '@/shared/api/config'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/render'

import { CreatePostForm } from '../components/CreatePostForm'

const POSTS_URL = `${API_BASE_URL}/posts`

function getTitle() {
  return screen.getByRole('textbox', { name: 'Title' })
}

function getBody() {
  return screen.getByRole('textbox', { name: 'Body' })
}

function countCreateRequests() {
  const counter = { count: 0 }
  server.events.on('request:start', ({ request }) => {
    if (request.method === 'POST') counter.count += 1
  })
  return counter
}

describe('CreatePostForm', () => {
  it('CP-01 renders title, body and publish', () => {
    renderWithProviders(<CreatePostForm userId={1} />)

    expect(screen.getByRole('form', { name: 'New post' })).toBeVisible()
    expect(getTitle()).toBeVisible()
    expect(getBody()).toBeVisible()
    expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled()
  })

  it('CP-04 shows accessible errors on submit and focuses the first invalid field', async () => {
    const requests = countCreateRequests()
    const { user } = renderWithProviders(<CreatePostForm userId={1} />)

    await user.click(screen.getByRole('button', { name: 'Publish' }))

    expect(getTitle()).toHaveAttribute('aria-invalid', 'true')
    expect(getTitle()).toHaveAccessibleDescription('Title is required')
    expect(getBody()).toHaveAttribute('aria-invalid', 'true')
    expect(getBody()).toHaveAccessibleDescription('Body is required')
    expect(getTitle()).toHaveFocus()
    expect(requests.count).toBe(0)
  })

  it('CP-02 shows "Title is required" on blur of a whitespace-only title', async () => {
    const { user } = renderWithProviders(<CreatePostForm userId={1} />)

    await user.type(getTitle(), '   ')
    await user.tab()

    expect(getTitle()).toHaveAccessibleDescription('Title is required')
  })

  it('CP-03 shows the max-length error on submit', async () => {
    const { user } = renderWithProviders(<CreatePostForm userId={1} />)

    await user.click(getTitle())
    await user.paste('a'.repeat(101))
    await user.click(screen.getByRole('button', { name: 'Publish' }))

    expect(getTitle()).toHaveAccessibleDescription('Title must be 100 characters or fewer')
  })

  it('CP-04 clears the error as soon as the value is valid', async () => {
    const { user } = renderWithProviders(<CreatePostForm userId={1} />)
    await user.click(screen.getByRole('button', { name: 'Publish' }))

    await user.type(getTitle(), 'H')

    expect(getTitle()).not.toHaveAttribute('aria-invalid')
    expect(getTitle()).not.toHaveAccessibleDescription()
  })

  it('CP-05 CP-06 sends trimmed values and disables publish while pending', async () => {
    let sentBody: unknown
    let contentType: string | null = null
    server.use(
      http.post(POSTS_URL, async ({ request }) => {
        sentBody = await request.json()
        contentType = request.headers.get('content-type')
        await delay(50)
        return HttpResponse.json({ ...(sentBody as object), id: 101 }, { status: 201 })
      }),
    )
    const { user } = renderWithProviders(<CreatePostForm userId={1} />)
    await user.type(getTitle(), ' Hello ')
    await user.type(getBody(), 'World')

    await user.click(screen.getByRole('button', { name: 'Publish' }))

    expect(await screen.findByRole('button', { name: 'Publishing…' })).toBeDisabled()
    expect(screen.getByRole('form', { name: 'New post' })).toHaveAttribute('aria-busy', 'true')
    expect(await screen.findByRole('status')).toHaveTextContent('Post published')
    expect(sentBody).toEqual({ title: 'Hello', body: 'World', userId: 1 })
    expect(contentType).toMatch(/^application\/json/)
    expect(getTitle()).toHaveValue('')
    expect(getBody()).toHaveValue('')
  })

  it('CP-10 shows an alert and keeps values on failure, then retries on submit', async () => {
    server.use(http.post(POSTS_URL, () => new HttpResponse(null, { status: 500 }), { once: true }))
    const { user } = renderWithProviders(<CreatePostForm userId={1} />)
    await user.type(getTitle(), 'Hello')
    await user.type(getBody(), 'World')

    await user.click(screen.getByRole('button', { name: 'Publish' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "We couldn't publish your post. Please try again.",
    )
    expect(getTitle()).toHaveValue('Hello')
    expect(getBody()).toHaveValue('World')

    await user.click(screen.getByRole('button', { name: 'Publish' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Post published')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('CP-11 does not retry a failed create', async () => {
    server.use(http.post(POSTS_URL, () => new HttpResponse(null, { status: 503 })))
    const requests = countCreateRequests()
    const { user } = renderWithProviders(<CreatePostForm userId={1} />)
    await user.type(getTitle(), 'Hello')
    await user.type(getBody(), 'World')

    await user.click(screen.getByRole('button', { name: 'Publish' }))

    await screen.findByRole('alert')
    expect(requests.count).toBe(1)
  })
})
