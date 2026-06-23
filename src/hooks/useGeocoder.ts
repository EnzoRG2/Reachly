import { useState, useEffect } from 'react'
import type { CityResult } from '../types'

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const CITY_TYPES = new Set(['city', 'town', 'village', 'administrative', 'municipality'])

export function useGeocoder(query: string): { results: CityResult[]; loading: boolean } {
  const [results, setResults] = useState<CityResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) { setResults([]); return }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=0`
        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'fr',
            'User-Agent': 'Reachly/1.0 (travel-comparison-demo)',
          },
        })
        const data: Array<{ name: string; display_name: string; lat: string; lon: string; type: string }> = await res.json()
        setResults(
          data
            .filter((r) => CITY_TYPES.has(r.type))
            .slice(0, 5)
            .map((r) => ({
              name: r.name || q,
              displayName: r.display_name,
              lat: parseFloat(r.lat),
              lng: parseFloat(r.lon),
            })),
        )
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 420)

    return () => clearTimeout(timer)
  }, [query])

  return { results, loading }
}
