import { QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'

import { createQueryClient } from '@/app/queryClient'
import { CreatedPostsProvider } from '@/features/posts/state/CreatedPostsProvider'

/** Fresh QueryClient per test with the app defaults, but without retries. */
export function createTestQueryClient() {
  const client = createQueryClient()
  client.setDefaultOptions({
    ...client.getDefaultOptions(),
    queries: { ...client.getDefaultOptions().queries, retry: false },
  })
  return client
}

/** Renders `ui` inside the app providers (query client and created posts) and returns a ready `userEvent` instance. */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  const client = createTestQueryClient()
  return {
    client,
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={client}>
        <CreatedPostsProvider>{ui}</CreatedPostsProvider>
      </QueryClientProvider>,
      options,
    ),
  }
}
