import { Component, type ErrorInfo, type ReactNode } from 'react'

export type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

/**
 * Last-resort boundary for unexpected render errors (AS-11). Async failures never reach it:
 * they are handled as query state by each panel. A class is required by React's API.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  override state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected render error', error, info.componentStack)
  }

  override render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="grid min-h-dvh place-items-center p-6">
        <div className="flex max-w-md flex-col items-center gap-3 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-fg-muted">An unexpected error occurred. Reloading usually fixes it.</p>
          <a
            href={window.location.href}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none"
          >
            Reload page
          </a>
        </div>
      </main>
    )
  }
}
