import AxeBuilder from '@axe-core/playwright'

import { mockApi } from './api.ts'
import { expect, test } from './fixtures.ts'

test('search and select a user', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')

  await page.getByRole('searchbox', { name: 'Search users by name' }).fill('ervin')
  await expect(page.getByRole('status').filter({ hasText: 'user' })).toHaveText('1 user')
  await page.getByRole('button', { name: /Ervin Howell/ }).click()

  await expect(page.getByRole('heading', { level: 2, name: 'Posts by Ervin Howell' })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(10)
  await expect(page).toHaveURL(/[?&]q=ervin/)
  await expect(page).toHaveURL(/[?&]user=2/)
})

test('users error state recovers on retry', async ({ page }) => {
  await mockApi(page, { failUsers: 3 })
  await page.goto('/')

  await expect(page.getByRole('heading', { name: "Couldn't load users" })).toBeVisible({
    timeout: 10_000,
  })
  await page.getByRole('button', { name: 'Try again' }).click()

  await expect(page.getByRole('list', { name: 'Users' }).getByRole('button')).toHaveCount(10)
})

test('mobile back to users', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await mockApi(page)
  await page.goto('/?user=1')

  await expect(
    page.getByRole('heading', { level: 2, name: 'Posts by Leanne Graham' }),
  ).toBeVisible()
  await expect(page.getByRole('list', { name: 'Users' })).toBeHidden()
  await page.getByRole('button', { name: 'Back to users' }).click()

  await expect(page.getByRole('list', { name: 'Users' })).toBeVisible()
  await expect(page).not.toHaveURL(/user=/)
})

test('has no detectable accessibility violations', async ({ page }) => {
  await mockApi(page)
  await page.goto('/?user=1')
  await expect(page.getByRole('article').first()).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()

  expect(results.violations).toEqual([])
})
