import { readFileSync } from 'node:fs'

import type { Page, Route } from '@playwright/test'

import { API_ORIGIN } from './fixtures.ts'

function fixture(name: string): unknown {
  return JSON.parse(readFileSync(new URL(`../src/test/fixtures/${name}`, import.meta.url), 'utf8'))
}

export const users = fixture('users.json') as { id: number; name: string }[]
export const postsUser1 = fixture('posts-user-1.json') as { title: string }[]
const postsByUser: Record<string, unknown> = {
  '1': postsUser1,
  '2': fixture('posts-user-2.json'),
}

export type ApiOptions = {
  /** Answers the first N `GET /users` requests with 500. */
  failUsers?: number
}

/** Mocks the three in-scope endpoints with real API fixtures (specs/api-contract.md). */
export async function mockApi(page: Page, { failUsers = 0 }: ApiOptions = {}) {
  let usersFailures = failUsers
  const json = (route: Route, body: unknown, status = 200) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

  await page.route(`${API_ORIGIN}/users`, (route) => {
    if (usersFailures > 0) {
      usersFailures -= 1
      return route.fulfill({ status: 500, body: '{}' })
    }
    return json(route, users)
  })
  await page.route(`${API_ORIGIN}/posts?userId=*`, (route) => {
    const userId = new URL(route.request().url()).searchParams.get('userId') ?? ''
    return json(route, postsByUser[userId] ?? [])
  })
  await page.route(`${API_ORIGIN}/posts`, (route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>
    return json(route, { ...body, id: 101 }, 201)
  })
}
