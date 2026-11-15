import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { API_BASE_URL } from '@/shared/api/config'
import { request } from '@/shared/api/httpClient'
import { server } from '@/test/msw/server'

import { createQueryClient } from './queryClient'

function countRequests(respond: () => Response) {
  const counter = { calls: 0 }
  server.use(
    http.get(`${API_BASE_URL}/items`, () => {
      counter.calls += 1
      return respond()
    }),
  )
  return counter
}

const itemsSchema = z.array(z.number())

async function fetchItems() {
  const client = createQueryClient()
  return client
    .query({
      queryKey: ['items'],
      queryFn: ({ signal }) => request('/items', itemsSchema, { signal }),
      retryDelay: 0,
    })
    .catch((e: unknown) => e)
}

describe('createQueryClient', () => {
  it('AS-07 does not retry 4xx responses', async () => {
    const counter = countRequests(() => new HttpResponse(null, { status: 404 }))

    await fetchItems()

    expect(counter.calls).toBe(1)
  })

  it('AS-07 does not retry invalid payloads', async () => {
    const counter = countRequests(() => HttpResponse.json({ not: 'an array' }))

    await fetchItems()

    expect(counter.calls).toBe(1)
  })

  it('AS-07 retries 5xx responses at most twice', async () => {
    const counter = countRequests(() => new HttpResponse(null, { status: 503 }))

    const error = await fetchItems()

    expect(counter.calls).toBe(3)
    expect(error).toMatchObject({ kind: 'http', status: 503 })
  })

  it('AS-07 retries network failures at most twice', async () => {
    const counter = countRequests(() => HttpResponse.error())

    await fetchItems()

    expect(counter.calls).toBe(3)
  })

  it('AS-07 recovers when a retry succeeds', async () => {
    let calls = 0
    server.use(
      http.get(`${API_BASE_URL}/items`, () => {
        calls += 1
        return calls === 1 ? HttpResponse.error() : HttpResponse.json([1])
      }),
    )

    const data = await fetchItems()

    expect(data).toEqual([1])
  })

  it('AS-07 does not retry unknown errors or mutations', async () => {
    const client = createQueryClient()
    let attempts = 0

    await client
      .query({
        queryKey: ['boom'],
        queryFn: () => {
          attempts += 1
          throw new Error('boom')
        },
        retryDelay: 0,
      })
      .catch(() => undefined)

    expect(attempts).toBe(1)
    expect(client.getDefaultOptions().mutations?.retry).toBe(false)
  })
})
