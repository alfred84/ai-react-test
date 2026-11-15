/**
 * Normalizes text for accent- and case-insensitive matching (UL-03): strips diacritics,
 * lowercases, trims and collapses inner whitespace. `"  José  Núñez"` becomes `"jose nunez"`.
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}
