import { screen, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { API_BASE_URL } from '@/shared/api/config'
import postsUser1 from '@/test/fixtures/posts-user-1.json'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/render'

import { PostsPanel } from '../components/PostsPanel'

const POSTS_URL = `${API_BASE_URL}/posts`
const LEANNE = { id: 1, name: 'Leanne Graham' }

describe('PostsPanel', () => {
  it('UP-01 asks to select a user', () => {
    renderWithProviders(<PostsPanel user={null} />)

    expect(
      screen.getByRole('heading', { name: 'Select a user to see their posts' }),
    ).toBeInTheDocument()
  })

  it('UP-02 loads posts for the selected user', async () => {
    renderWithProviders(<PostsPanel user={LEANNE} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Posts by Leanne Graham' })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Posts by Leanne Graham' })).toHaveAttribute(
      'aria-busy',
      'true',
    )
    expect(await screen.findAllByRole('article')).toHaveLength(10)
    expect(screen.getByRole('region', { name: 'Posts by Leanne Graham' })).toHaveAttribute(
      'aria-busy',
      'false',
    )
  })

  it('UP-03 renders posts as articles with line breaks', async () => {
    const [firstPost] = postsUser1

    renderWithProviders(<PostsPanel user={LEANNE} />)

    const [firstArticle] = await screen.findAllByRole('article')
    if (!firstArticle || !firstPost) throw new Error('expected a first post')
    expect(
      within(firstArticle).getByRole('heading', { level: 3, name: firstPost.title }),
    ).toBeVisible()
    const body = within(firstArticle).getByText(/^quia et suscipit/)
    expect(body.textContent).toBe(firstPost.body)
    expect(body.textContent).toContain('\n')
  })

  it('UP-04 shows an empty state when there are no posts', async () => {
    server.use(http.get(POSTS_URL, () => HttpResponse.json([])))

    renderWithProviders(<PostsPanel user={LEANNE} />)

    expect(
      await screen.findByRole('heading', { name: "Leanne Graham hasn't posted yet" }),
    ).toBeVisible()
  })

  it('UP-05 shows an error and recovers on retry', async () => {
    server.use(http.get(POSTS_URL, () => new HttpResponse(null, { status: 500 }), { once: true }))
    const { user } = renderWithProviders(<PostsPanel user={LEANNE} />)

    expect(await screen.findByRole('heading', { name: "Couldn't load posts" })).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('status 500')

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findAllByRole('article')).toHaveLength(10)
  })

  it('CP-07 shows the new post first with a badge', async () => {
    const { user } = renderWithProviders(<PostsPanel user={LEANNE} />)
    await screen.findAllByRole('article')

    await publish(user, 'Hello', 'World')

    expect(await screen.findByRole('status')).toHaveTextContent('Post published')
    const [firstArticle] = screen.getAllByRole('article')
    if (!firstArticle) throw new Error('expected a first post')
    expect(within(firstArticle).getByRole('heading', { level: 3, name: 'Hello' })).toBeVisible()
    expect(within(firstArticle).getByText('New')).toBeVisible()
    expect(screen.getAllByRole('article')).toHaveLength(11)
  })

  it('CP-08 keeps posts with the same server id distinct', async () => {
    const consoleError = vi.spyOn(console, 'error')
    const { user } = renderWithProviders(<PostsPanel user={LEANNE} />)
    await screen.findAllByRole('article')

    await publish(user, 'First', 'One')
    await screen.findByRole('heading', { level: 3, name: 'First' })
    await publish(user, 'Second', 'Two')
    await screen.findByRole('heading', { level: 3, name: 'Second' })

    const titles = screen
      .getAllByRole('article')
      .slice(0, 2)
      .map((article) => within(article).getByRole('heading', { level: 3 }).textContent)
    expect(titles).toEqual(['Second', 'First'])
    expect(consoleError).not.toHaveBeenCalled()
  })
})

async function publish(user: UserEvent, title: string, body: string) {
  await user.type(screen.getByRole('textbox', { name: 'Title' }), title)
  await user.type(screen.getByRole('textbox', { name: 'Body' }), body)
  await user.click(screen.getByRole('button', { name: 'Publish' }))
}
