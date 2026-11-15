import type { ComponentProps } from 'react'

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary'
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-accent-fg hover:opacity-90',
  secondary: 'border border-border bg-surface text-fg hover:bg-surface-muted',
}

/** Native button with the design system's variants and focus ring. Defaults to `type="button"`. */
export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 motion-safe:transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
