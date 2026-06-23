import type { Destination, TransportMode, CompareOption } from '../types'

export function getMinMode(
  dest: Destination,
  activeModes: TransportMode[],
): TransportMode | null {
  let best: TransportMode | null = null
  let bestPrice = Infinity

  for (const m of activeModes) {
    const opt = dest[m]
    if (opt && opt.price < bestPrice) {
      bestPrice = opt.price
      best = m
    }
  }

  return best
}

export function buildCompareOptions(
  dest: Destination,
  activeModes: TransportMode[],
  sortBy: 'price' | 'time',
): CompareOption[] {
  return activeModes
    .filter((m): boolean => dest[m] !== null)
    .map((m) => ({ mode: m, ...dest[m]! }))
    .sort((a, b) =>
      sortBy === 'price'
        ? a.price - b.price
        : parseFloat(a.time) - parseFloat(b.time),
    )
}

export function filterDestinations(
  dests: Destination[],
  activeModes: TransportMode[],
  budget: number,
  timeMax: number,
): Destination[] {
  return dests.filter((d) => {
    const best = getMinMode(d, activeModes)
    if (!best) return false
    if (d[best]!.price > budget) return false
    return activeModes.some((m) => d[m] && parseFloat(d[m]!.time) <= timeMax + 1.5)
  })
}
