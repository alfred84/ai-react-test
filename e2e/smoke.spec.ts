import { expect, test } from './fixtures.ts'

test('app shell loads', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'Users and Posts' })).toBeVisible()
})
