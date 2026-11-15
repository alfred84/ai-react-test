import { test as base, expect } from '@playwright/test'

export const API_ORIGIN = 'https://jsonplaceholder.typicode.com'

/**
 * Playwright `test` with a deterministic network: any API request that a spec
 * does not explicitly mock fails with 599, so e2e never depends on the live API.
 * Routes registered later inside a spec take precedence over this fallback.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(`${API_ORIGIN}/**`, (route) =>
      route.fulfill({ status: 599, body: `Unmocked request: ${route.request().url()}` }),
    )
    await use(page)
  },
})

export { expect }
