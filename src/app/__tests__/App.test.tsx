import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import App from '@/app/App'
import { API_BASE_URL } from '@/shared/api/config'
import postsUser1 from '@/test/fixtures/posts-user-1.json'
import postsUser2 from '@/test/fixtures/posts-user-2.json'
import { server } from '@/test/msw/server'

const POSTS_URL = `${API_BASE_URL}/posts`
const [firstPostUser1] = postsUser1
const [firstPostUser2] = postsUser2

function postsFor(userId: string | null) {
  if (userId === '1') return postsUser1
  if (userId === '2') return postsUser2
  return []
}

function renderApp(url = '/') {
  window.history.replaceState(null, '', url)
  return { user: userEvent.setup(), ...render(<App />) }
}

describe('App', () => {
  it('renders the main heading', () => {
    renderApp()

    expect(screen.getByRole('heading', { level: 1, name: 'Users and Posts' })).toBeInTheDocument()
  })

  it('UP-06 cancels stale requests when switching users', async () => {
    const aborted: string[] = []
    server.use(
      http.get(POSTS_URL, async ({ request }) => {
        const userId = new URL(request.url).searchParams.get('userId')
        request.signal.addEventListener('abort', () => {
          aborted.push(userId ?? '')
        })
        if (userId === '1') await delay(200)
        return HttpResponse.json(postsFor(userId))
      }),
    )
    const { user } = renderApp()

    await user.click(await screen.findByRole('button', { name: /Leanne Graham/ }))
    await user.click(screen.getByRole('button', { name: /Ervin Howell/ }))

    expect(
      await screen.findByRole('heading', { level: 3, name: firstPostUser2?.title }),
    ).toBeVisible()
    await delay(300)
    expect(aborted).toEqual(['1'])
    expect(screen.queryByRole('heading', { name: firstPostUser1?.title })).not.toBeInTheDocument()
  })

  it('UP-07 restores the selection from the URL', async () => {
    renderApp('/?user=2')

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Posts by Ervin Howell' }),
    ).toBeVisible()
  })

  it('UP-07 ignores a non-numeric user parameter', async () => {
    renderApp('/?user=abc')

    await screen.findByRole('button', { name: /Leanne Graham/ })

    expect(
      screen.getByRole('heading', { name: 'Select a user to see their posts' }),
    ).toBeInTheDocument()
  })

  it('UP-07 shows "User not found" for an unknown id and goes back', async () => {
    const { user } = renderApp('/?user=999')

    expect(await screen.findByRole('heading', { name: 'User not found' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Back to users' }))

    expect(window.location.search).toBe('')
    expect(
      screen.getByRole('heading', { name: 'Select a user to see their posts' }),
    ).toBeInTheDocument()
  })

  it('UP-08 "Back to users" clears the selection', async () => {
    const { user } = renderApp('/?user=1')
    await screen.findByRole('heading', { level: 2, name: 'Posts by Leanne Graham' })

    await user.click(screen.getByRole('button', { name: 'Back to users' }))

    expect(window.location.search).toBe('')
    expect(
      screen.getByRole('heading', { name: 'Select a user to see their posts' }),
    ).toBeInTheDocument()
  })

  it('UP-09 reuses cached posts when reselecting', async () => {
    let postRequests = 0
    server.use(
      http.get(POSTS_URL, ({ request }) => {
        postRequests += 1
        return HttpResponse.json(postsFor(new URL(request.url).searchParams.get('userId')))
      }),
    )
    const { user } = renderApp()
    await user.click(await screen.findByRole('button', { name: /Leanne Graham/ }))
    await screen.findByRole('heading', { level: 3, name: firstPostUser1?.title })
    await user.click(screen.getByRole('button', { name: /Ervin Howell/ }))
    await screen.findByRole('heading', { level: 3, name: firstPostUser2?.title })

    await user.click(screen.getByRole('button', { name: /Leanne Graham/ }))

    expect(screen.getByRole('heading', { level: 3, name: firstPostUser1?.title })).toBeVisible()
    expect(postRequests).toBe(2)
  })

  it('CP-09 keeps created posts per user across switches', async () => {
    const { user } = renderApp('/?user=1')
    await screen.findByRole('heading', { level: 3, name: firstPostUser1?.title })
    await user.type(screen.getByRole('textbox', { name: 'Title' }), 'Mine')
    await user.type(screen.getByRole('textbox', { name: 'Body' }), 'Text')
    await user.click(screen.getByRole('button', { name: 'Publish' }))
    await screen.findByRole('heading', { level: 3, name: 'Mine' })

    await user.click(screen.getByRole('button', { name: /Ervin Howell/ }))
    await screen.findByRole('heading', { level: 3, name: firstPostUser2?.title })
    const mineOnErvin = screen.queryByRole('heading', { level: 3, name: 'Mine' })
    await user.click(screen.getByRole('button', { name: /Leanne Graham/ }))

    expect(mineOnErvin).not.toBeInTheDocument()
    const [firstArticle] = await screen.findAllByRole('article')
    expect(firstArticle).toHaveTextContent('Mine')
  })
})
