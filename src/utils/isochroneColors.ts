import { parseHours } from './transport'

export interface TimeZone {
  maxHours: number
  label: string
  pinColor: string
}

export const TIME_ZONES: TimeZone[] = [
  { maxHours: 2,   label: '< 2h',  pinColor: '#16A34A' },
  { maxHours: 4,   label: '2–4h',  pinColor: '#65A30D' },
  { maxHours: 6,   label: '4–6h',  pinColor: '#CA8A04' },
  { maxHours: 999, label: '6h+',   pinColor: '#EA580C' },
]

export function getTimeZone(hours: number): TimeZone {
  return TIME_ZONES.find((z) => hours <= z.maxHours) ?? TIME_ZONES[TIME_ZONES.length - 1]
}

export function getBestHours(
  dest: { train: { time: string } | null; bus: { time: string } | null; plane: { time: string } | null; car: { time: string } | null },
  activeModes: string[],
): number {
  let best = Infinity
  for (const m of activeModes) {
    const opt = dest[m as keyof typeof dest] as { time: string } | null
    if (opt) {
      const h = parseHours(opt.time)
      if (h < best) best = h
    }
  }
  return best === Infinity ? 99 : best
}
