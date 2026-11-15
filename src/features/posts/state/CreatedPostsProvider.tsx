import type { ReactNode } from 'react'

export type CreatedPostsProviderProps = {
  children: ReactNode
}

export function CreatedPostsProvider({ children }: CreatedPostsProviderProps) {
  return children
}
