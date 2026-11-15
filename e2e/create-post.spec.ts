import { mockApi, postsUser1 } from './api.ts'
import { expect, test } from './fixtures.ts'

test('validation blocks submit; valid post appears', async ({ page }) => {
  await mockApi(page)
  const createRequests: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST') createRequests.push(request.url())
  })
  await page.goto('/?user=1')
  await expect(page.getByRole('heading', { name: postsUser1[0]?.title })).toBeVisible()
  const title = page.getByRole('textbox', { name: 'Title' })
  const body = page.getByRole('textbox', { name: 'Body' })

  await page.getByRole('button', { name: 'Publish' }).click()

  await expect(title).toHaveAttribute('aria-invalid', 'true')
  await expect(title).toHaveAccessibleDescription('Title is required')
  await expect(body).toHaveAccessibleDescription('Body is required')
  await expect(title).toBeFocused()
  expect(createRequests).toEqual([])

  await title.fill('Hello from e2e')
  await body.fill('First line\nSecond line')
  await page.getByRole('button', { name: 'Publish' }).click()

  await expect(page.getByText('Post published')).toBeVisible()
  const firstArticle = page.getByRole('article').first()
  await expect(firstArticle.getByRole('heading', { name: 'Hello from e2e' })).toBeVisible()
  await expect(firstArticle.getByText('New')).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(11)
  expect(createRequests).toHaveLength(1)
})
