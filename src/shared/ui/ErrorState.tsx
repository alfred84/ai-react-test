import { CircleAlert, RotateCw } from 'lucide-react'

import { getErrorMessage } from '@/shared/api/errorMessage'

import { Button } from './Button'

export type ErrorStateProps = {
  title: string
  error: unknown
  onRetry: () => void
}

/** Friendly error panel with the mapped message and a retry action (AS-09). */
export function ErrorState({ title, error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-danger/30 bg-danger-subtle p-6 text-center">
      <CircleAlert aria-hidden="true" className="size-8 text-danger" />
      <h3 className="font-semibold">{title}</h3>
      <p role="alert" className="max-w-prose text-sm text-fg-muted">
        {getErrorMessage(error)}
      </p>
      <Button variant="secondary" onClick={onRetry}>
        <RotateCw aria-hidden="true" className="size-4" />
        Try again
      </Button>
    </div>
  )
}
