import { useState, useEffect } from 'react'

type WeatherMap = Record<number, number> // destId → °C

export function useWeatherBatch(
  dests: { id: number; lat: number; lng: number }[],
): WeatherMap {
  const [temps, setTemps] = useState<WeatherMap>({})

  useEffect(() => {
    Promise.all(
      dests.map((d) =>
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lng}&current=temperature_2m&timezone=auto`,
        )
          .then((r) => r.json())
          .then((data) => [d.id, Math.round(data.current.temperature_2m)] as const)
          .catch(() => [d.id, null] as const),
      ),
    ).then((entries) => {
      const map: WeatherMap = {}
      for (const [id, temp] of entries) {
        if (temp !== null) map[id] = temp
      }
      setTemps(map)
    })
  }, []) // mount only — destination coords don't change

  return temps
}
