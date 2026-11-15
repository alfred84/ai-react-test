import type { ReactNode } from 'react'

export type AppErrorBoundaryProps = {
  children: ReactNode
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return children
}
