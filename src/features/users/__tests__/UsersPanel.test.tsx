import { screen, within } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { API_BASE_URL } from '@/shared/api/config'
import users from '@/test/fixtures/users.json'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/render'

import { UsersPanel } from '../components/UsersPanel'

const USERS_URL = `${API_BASE_URL}/users`

function getUserList() {
  return screen.getByRole('list', { name: 'Users' })
}

async function renderLoaded() {
  const view = renderWithProviders(<UsersPanel />)
  await screen.findByRole('button', { name: /Leanne Graham/ })
  return view
}

describe('UsersPanel', () => {
  it('AS-08 shows a skeleton while loading', async () => {
    server.use(
      http.get(USERS_URL, async () => {
        await delay(50)
        return HttpResponse.json(users)
      }),
    )

    renderWithProviders(<UsersPanel />)

    const region = screen.getByRole('region', { name: 'Users' })
    expect(region).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Loading users…')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
    expect(region).toHaveAttribute('aria-busy', 'false')
  })

  it('UL-01 renders users with avatar initials and email', async () => {
    await renderLoaded()

    const items = within(getUserList()).getAllByRole('button')
    expect(items).toHaveLength(10)
    const leanne = screen.getByRole('button', { name: /Leanne Graham/ })
    expect(leanne).toHaveTextContent('LG')
    expect(leanne).toHaveTextContent('Sincere@april.biz')
  })

  it('UL-02 filters by name ignoring case', async () => {
    const { user } = await renderLoaded()

    await user.type(screen.getByRole('searchbox', { name: 'Search users by name' }), 'CLEMENT')

    expect(await screen.findByText('2 users')).toBeInTheDocument()
    const names = within(getUserList())
      .getAllByRole('button')
      .map((button) => button.textContent)
    expect(names).toEqual([
      expect.stringContaining('Clementine Bauch'),
      expect.stringContaining('Clementina DuBuque'),
    ])
  })

  it('UL-03 matches names regardless of accents', async () => {
    const accented = users.map((u) => (u.id === 1 ? { ...u, name: 'José Núñez' } : u))
    server.use(http.get(USERS_URL, () => HttpResponse.json(accented)))
    const { user } = renderWithProviders(<UsersPanel />)
    const search = await screen.findByRole('searchbox', { name: 'Search users by name' })

    await user.type(search, 'jose nunez')

    expect(await screen.findByText('1 user')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /José Núñez/ })).toBeInTheDocument()
  })

  it('UL-05 initializes the search from the q parameter and syncs changes back', async () => {
    window.history.replaceState(null, '', '/?q=ervin')
    const { user } = renderWithProviders(<UsersPanel />)

    const search = await screen.findByRole('searchbox', { name: 'Search users by name' })
    expect(search).toHaveValue('ervin')
    expect(await screen.findByText('1 user')).toBeInTheDocument()
    expect(within(getUserList()).getAllByRole('button')).toHaveLength(1)

    await user.clear(search)

    expect(await screen.findByText('10 users')).toBeInTheDocument()
    expect(window.location.search).toBe('')
  })

  it('UL-05 stores the trimmed search in the URL', async () => {
    const { user } = await renderLoaded()

    await user.type(screen.getByRole('searchbox', { name: 'Search users by name' }), '  leanne ')

    expect(await screen.findByText('1 user')).toBeInTheDocument()
    expect(new URLSearchParams(window.location.search).get('q')).toBe('leanne')
  })

  it('UL-06 shows an empty state with clear search', async () => {
    const { user } = await renderLoaded()
    const search = screen.getByRole('searchbox', { name: 'Search users by name' })

    await user.type(search, 'zzz')

    expect(await screen.findByRole('heading', { name: 'No users match "zzz"' })).toBeInTheDocument()
    expect(screen.getByText('0 users')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(await screen.findByText('10 users')).toBeInTheDocument()
    expect(search).toHaveValue('')
    expect(search).toHaveFocus()
  })

  it('UL-07 announces the result count in a polite live region', async () => {
    await renderLoaded()

    expect(screen.getByRole('status')).toHaveTextContent('10 users')
  })

  it('UL-08 selects a user and marks it current', async () => {
    const { user } = await renderLoaded()
    const ervin = screen.getByRole('button', { name: /Ervin Howell/ })

    await user.click(ervin)

    expect(new URLSearchParams(window.location.search).get('user')).toBe('2')
    expect(ervin).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: /Leanne Graham/ })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('UL-09 shows an error and recovers on retry', async () => {
    server.use(http.get(USERS_URL, () => new HttpResponse(null, { status: 500 }), { once: true }))
    const { user } = renderWithProviders(<UsersPanel />)

    expect(await screen.findByRole('heading', { name: "Couldn't load users" })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('status 500')

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('button', { name: /Leanne Graham/ })).toBeInTheDocument()
  })
})
