import { describe, expect, it } from 'vitest'

import { normalizeText } from './normalizeText'

describe('normalizeText', () => {
  it.each([
    ['José Núñez', 'jose nunez'],
    ['CLEMENTINE', 'clementine'],
    ['  Mrs.   Dennis  Schulist ', 'mrs. dennis schulist'],
    ['Runolfsdóttir', 'runolfsdottir'],
    ['', ''],
  ])('UL-03 removes diacritics, case and extra whitespace: %j', (input, expected) => {
    expect(normalizeText(input)).toBe(expected)
  })
})
