import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { AppErrorBoundary } from './AppErrorBoundary'
import { createQueryClient } from './queryClient'

function App() {
  const [queryClient] = useState(createQueryClient)

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <main className="min-h-dvh p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Users and Posts</h1>
        </main>
      </QueryClientProvider>
    </AppErrorBoundary>
  )
}

export default App
