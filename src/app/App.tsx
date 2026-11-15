import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { UsersPanel } from '@/features/users/components/UsersPanel'
import { useSelectedUserId } from '@/shared/lib/useSelectedUserId'

import { AppErrorBoundary } from './AppErrorBoundary'
import { createQueryClient } from './queryClient'
import { SelectedUserPosts } from './SelectedUserPosts'

function App() {
  const [queryClient] = useState(createQueryClient)
  const [selectedUserId] = useSelectedUserId()
  const hasSelection = selectedUserId !== null

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-dvh">
          <header className="border-b border-border bg-surface">
            <div className="mx-auto max-w-6xl px-4 py-4">
              <h1 className="text-2xl font-semibold tracking-tight">Users and Posts</h1>
            </div>
          </header>
          <main className="mx-auto grid max-w-6xl items-start gap-4 p-4 md:grid-cols-[20rem_1fr]">
            <div className={hasSelection ? 'hidden md:block' : ''}>
              <UsersPanel />
            </div>
            <div className={hasSelection ? '' : 'hidden md:block'}>
              <SelectedUserPosts />
            </div>
          </main>
        </div>
      </QueryClientProvider>
    </AppErrorBoundary>
  )
}

export default App
