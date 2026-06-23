const EARTH_RADIUS_KM = 6371

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(a))
}

export function formatHours(h: number): string {
  const hours = Math.floor(h)
  const mins = Math.round((h - hours) * 60)
  if (mins === 0) return `${hours}h`
  return `${hours}h${mins.toString().padStart(2, '0')}`
}
