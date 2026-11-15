import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

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
})
