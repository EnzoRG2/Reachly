import type { Destination, TransportMode, CompareOption, TransportOption } from '../types'
import { haversineKm, formatHours } from './geo'

/** "4h30" → 4.5 · "1h20" → 1.33 · "15h" → 15 */
export function parseHours(time: string): number {
  const m = time.match(/^(\d+)h(\d+)?/)
  if (!m) return parseFloat(time) || 0
  return parseInt(m[1], 10) + (m[2] ? parseInt(m[2], 10) / 60 : 0)
}

export function getMinMode(dest: Destination, activeModes: TransportMode[]): TransportMode | null {
  let best: TransportMode | null = null
  let bestPrice = Infinity
  for (const m of activeModes) {
    const opt = dest[m]
    if (opt && opt.price < bestPrice) { bestPrice = opt.price; best = m }
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
        : parseHours(a.time) - parseHours(b.time),
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
    return activeModes.some((m) => d[m] && parseHours(d[m]!.time) <= timeMax)
  })
}

// ── Dynamic scaling when departure changes ────────────────────────────────

const LYON = { lat: 45.764, lng: 4.8357 }

const MODE_FLOOR: Record<TransportMode, { price: number; hours: number }> = {
  train: { price: 8,  hours: 0.5  },
  bus:   { price: 4,  hours: 0.75 },
  plane: { price: 32, hours: 1.0  },
  car:   { price: 5,  hours: 0.25 },
}

function scaleOption(opt: TransportOption | null, mode: TransportMode, ratio: number): TransportOption | null {
  if (!opt) return null
  const floor = MODE_FLOOR[mode]
  return {
    ...opt,
    price: Math.max(floor.price, Math.round(opt.price * ratio)),
    time: formatHours(Math.max(floor.hours, parseHours(opt.time) * ratio)),
    co2: Math.max(0.1, parseFloat((opt.co2 * ratio).toFixed(1))),
  }
}

export function scaleDestinations(
  dests: Destination[],
  fromLat: number,
  fromLng: number,
): Destination[] {
  const results: Destination[] = []
  for (const d of dests) {
    const distFrom = haversineKm(fromLat, fromLng, d.lat, d.lng)
    if (distFrom < 40) continue // departure IS the destination or too close

    const distLyon = haversineKm(LYON.lat, LYON.lng, d.lat, d.lng)
    const ratio = distLyon > 0 ? distFrom / distLyon : 1

    results.push({
      ...d,
      train: scaleOption(d.train, 'train', ratio),
      bus:   scaleOption(d.bus,   'bus',   ratio),
      plane: scaleOption(d.plane, 'plane', ratio),
      car:   scaleOption(d.car,   'car',   ratio),
    })
  }
  return results
}
