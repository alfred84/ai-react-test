export type AvatarProps = {
  name: string
}

/** Initials of the first two words: "Leanne Graham" → "LG", "Mrs. Dennis Schulist" → "MD". */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
}

/** Decorative initials avatar; the accessible name comes from the surrounding text. */
export function Avatar({ name }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-subtle text-sm font-semibold text-accent"
    >
      {getInitials(name)}
    </span>
  )
}
