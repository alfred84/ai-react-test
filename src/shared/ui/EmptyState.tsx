import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type EmptyStateProps = {
  icon: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
}

export function EmptyState(_props: EmptyStateProps) {
  return null
}
