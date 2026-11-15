import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type EmptyStateProps = {
  icon: LucideIcon
  title: string
  /** Guidance text telling the user what to do next. */
  children?: ReactNode
  action?: ReactNode
}

/** Icon, title and guidance for "nothing to show" situations (AS-10). */
export function EmptyState({ icon: Icon, title, children, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <span className="mb-1 rounded-full bg-accent-subtle p-3">
        <Icon aria-hidden="true" className="size-6 text-accent" />
      </span>
      <h3 className="font-semibold">{title}</h3>
      {children && <p className="max-w-prose text-sm text-fg-muted">{children}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
