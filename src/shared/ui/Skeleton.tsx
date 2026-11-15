export type SkeletonProps = {
  className?: string
}

/** Decorative placeholder block; pulses only when the user allows motion (AS-08). */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md bg-surface-muted motion-safe:animate-pulse ${className}`}
    />
  )
}
