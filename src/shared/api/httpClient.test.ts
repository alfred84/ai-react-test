import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { server } from '@/test/msw/server'

import { ApiError } from './apiError'
import { API_BASE_URL } from './config'
import { request } from './httpClient'

const itemSchema = z.array(z.object({ id: z.number() }))

describe('request', () => {
  it('AS-01 requests base URL with JSON headers', async () => {
    let captured: Request | undefined
    server.use(
      http.get(`${API_BASE_URL}/items`, ({ request: req }) => {
        captured = req
        return HttpResponse.json([{ id: 1, extra: 'ignored' }])
      }),
    )

    const data = await request('/items', itemSchema)

    expect(data).toEqual([{ id: 1 }])
    expect(captured?.url).toBe('https://jsonplaceholder.typicode.com/items')
    expect(captured?.method).toBe('GET')
    expect(captured?.headers.get('accept')).toBe('application/json')
    expect(captured?.headers.has('content-type')).toBe(false)
  })

  it('AS-01 sends a JSON body with the JSON content type', async () => {
    let contentType: string | null = null
    let body: unknown
    server.use(
      http.post(`${API_BASE_URL}/items`, async ({ request: req }) => {
        contentType = req.headers.get('content-type')
        body = await req.json()
        return HttpResponse.json({ id: 101 }, { status: 201 })
      }),
    )

    const data = await request('/items', z.object({ id: z.number() }), {
      method: 'POST',
      body: { title: 'Hello' },
    })

    expect(data).toEqual({ id: 101 })
    expect(contentType).toBe('application/json; charset=UTF-8')
    expect(body).toEqual({ title: 'Hello' })
  })

  it('AS-02 maps network failures to network errors', async () => {
    server.use(http.get(`${API_BASE_URL}/items`, () => HttpResponse.error()))

    const error: unknown = await request('/items', itemSchema).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ kind: 'network', status: undefined })
  })

  it('AS-03 maps non-2xx responses to http errors without parsing the body', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}/items`,
        () =>
          new HttpResponse('<pre>SyntaxError</pre>', {
            status: 500,
            headers: { 'Content-Type': 'text/html' },
          }),
      ),
    )

    const error: unknown = await request('/items', itemSchema).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ kind: 'http', status: 500 })
  })

  it('AS-04 maps a payload that fails validation to a parse error', async () => {
    server.use(http.get(`${API_BASE_URL}/items`, () => HttpResponse.json([{ id: 'x' }])))

    const error: unknown = await request('/items', itemSchema).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ kind: 'parse' })
  })

  it('AS-04 maps an invalid JSON body to a parse error', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}/items`,
        () => new HttpResponse('not json', { headers: { 'Content-Type': 'application/json' } }),
      ),
    )

    const error: unknown = await request('/items', itemSchema).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ kind: 'parse' })
  })

  it('AS-05 rethrows aborts untouched', async () => {
    server.use(
      http.get(`${API_BASE_URL}/items`, async () => {
        await delay('infinite')
        return HttpResponse.json([])
      }),
    )
    const controller = new AbortController()

    const pending = request('/items', itemSchema, { signal: controller.signal }).catch(
      (e: unknown) => e,
    )
    controller.abort()
    const error = await pending

    expect(error).not.toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ name: 'AbortError' })
  })
})
