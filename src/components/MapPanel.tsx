import { useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, ZoomControl, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { CityResult, Destination, TransportMode } from '../types'
import { DESTS } from '../data/destinations'
import { getMinMode } from '../utils/transport'

const KM_PER_HOUR = 90

function MapController({ fromCity, selected }: { fromCity: CityResult; selected: Destination | null }) {
  const map = useMap()
  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 7, { duration: 1.4 })
    } else {
      map.flyTo([fromCity.lat, fromCity.lng], 6, { duration: 1 })
    }
  }, [selected, fromCity, map])
  return null
}

function makePinIcon(price: number | null, active: boolean, isSelected: boolean) {
  if (!active || price === null) {
    return divIcon({
      html: `<div style="width:8px;height:8px;border-radius:50%;background:#D1C9BE;border:1.5px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.15);"></div>`,
      className: '', iconSize: [8, 8], iconAnchor: [4, 4],
    })
  }
  const dotColor = isSelected ? '#2563EB' : '#F97316'
  const border = isSelected ? '#2563EB' : '#E5E7EB'
  const shadow = isSelected ? '0 2px 10px rgba(37,99,235,0.35)' : '0 1px 5px rgba(0,0,0,0.15)'
  const scale = isSelected ? 'transform:scale(1.15);' : ''
  return divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;${scale}">
      <div style="background:#fff;border-radius:20px;padding:2px 8px;font-size:11px;font-weight:700;font-family:Inter,system-ui,sans-serif;color:#111827;border:1.5px solid ${border};box-shadow:${shadow};white-space:nowrap;">€${price}</div>
      <div style="width:6px;height:6px;border-radius:50%;background:${dotColor};box-shadow:0 0 5px ${dotColor}90;"></div>
    </div>`,
    className: '', iconSize: [52, 25], iconAnchor: [26, 25],
  })
}

function makeOriginIcon(city: CityResult) {
  return {
    dot: divIcon({
      html: `<div style="width:12px;height:12px;border-radius:50%;background:#2563EB;border:2.5px solid #fff;box-shadow:0 0 0 3px rgba(37,99,235,0.25);"></div>`,
      className: '', iconSize: [12, 12], iconAnchor: [6, 6],
    }),
    label: divIcon({
      html: `<div style="background:#2563EB;border-radius:20px;padding:4px 12px;font-size:11px;font-weight:700;font-family:Inter,system-ui,sans-serif;color:#fff;box-shadow:0 2px 12px rgba(37,99,235,0.35);white-space:nowrap;">${city.name}</div>`,
      className: '', iconSize: [0, 0], iconAnchor: [-6, 28],
    }),
  }
}

interface MapPanelProps {
  activeModes: TransportMode[]
  visibleDests: Destination[]
  selected: Destination | null
  timeMax: number
  budget: number
  fromCity: CityResult
  onSelectDest: (d: Destination) => void
}

export function MapPanel({ activeModes, visibleDests, selected, timeMax, fromCity, onSelectDest }: MapPanelProps) {
  const radiusM = timeMax * KM_PER_HOUR * 1000
  const origin: [number, number] = [fromCity.lat, fromCity.lng]
  const icons = makeOriginIcon(fromCity)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer center={origin} zoom={6} style={{ width: '100%', height: '100%' }}
        zoomControl={false} scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd" maxZoom={19}
        />
        <ZoomControl position="bottomright" />
        <MapController fromCity={fromCity} selected={selected} />

        {/* Isochrone */}
        <Circle center={origin} radius={radiusM * 1.10}
          pathOptions={{ fillColor: '#3B82F6', fillOpacity: 0.04, color: 'transparent', weight: 0 }} />
        <Circle center={origin} radius={radiusM}
          pathOptions={{ fillColor: '#3B82F6', fillOpacity: 0.09, color: '#2563EB', weight: 1, opacity: 0.18 }} />

        {/* Departure city */}
        <Marker position={origin} icon={icons.dot} interactive={false} />
        <Marker position={origin} icon={icons.label} interactive={false} />

        {/* Destination pins */}
        {DESTS.map((d) => {
          const isActive = visibleDests.some((v) => v.id === d.id)
          const scaled = visibleDests.find((v) => v.id === d.id) ?? d
          const bestMode = getMinMode(scaled, activeModes)
          const bestData = bestMode ? scaled[bestMode] : null
          const isSelected = selected?.id === d.id
          const icon = makePinIcon(bestData?.price ?? null, isActive, isSelected)

          return (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={icon}
              opacity={isActive ? 1 : 0.28}
              eventHandlers={{ click: () => onSelectDest(scaled) }}
            />
          )
        })}
      </MapContainer>

      <div style={{
        position: 'absolute', bottom: 36, left: 12, zIndex: 1000,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
        border: '1px solid #E5E7EB', borderRadius: 10,
        padding: '5px 12px', fontSize: 11, fontWeight: 600, color: '#6B7280',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontWeight: 800, color: '#2563EB' }}>{visibleDests.length}</span>
        <span>destination{visibleDests.length > 1 ? 's' : ''} en {timeMax}h</span>
      </div>
    </div>
  )
}
