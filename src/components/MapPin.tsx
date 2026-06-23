import { useState } from 'react'
import type { Destination, TransportMode } from '../types'
import { MODES } from '../data/modes'
import { getMinMode } from '../utils/transport'

interface MapPinProps {
  dest: Destination
  color: string
  active: boolean
  activeModes: TransportMode[]
  onClick: () => void
}

export function MapPin({ dest, color, active, activeModes, onClick }: MapPinProps) {
  const [hovered, setHovered] = useState(false)
  const bestMode = getMinMode(dest, activeModes)
  const bestData = bestMode ? dest[bestMode] : null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${dest.px}%`,
        top: `${dest.py}%`,
        transform: 'translate(-50%,-50%)',
        cursor: 'pointer',
        zIndex: hovered ? 20 : 5,
        transition: 'all 0.2s',
        opacity: active ? 1 : 0.25,
      }}
    >
      {hovered && active && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111827',
            color: '#fff',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 11,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 2 }}>
            {dest.emoji} {dest.name}
          </div>
          {bestData && bestMode && (
            <div style={{ color: '#9CA3AF' }}>
              {MODES[bestMode].label} · {bestData.price}€ · {bestData.time}
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 8,
              height: 8,
              background: '#111827',
              clipPath: 'polygon(0 0,100% 0,50% 100%)',
            }}
          />
        </div>
      )}

      {active && bestData ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: '3px 8px',
            fontSize: 11,
            fontWeight: 700,
            color: '#111827',
            border: `2px solid ${color}`,
            boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.12)',
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
            transition: 'all 0.15s',
            position: 'relative',
          }}
        >
          {bestData.price}€
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: `5px solid ${color}`,
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: active ? color : '#D1D5DB',
            border: '2px solid white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
      )}
    </div>
  )
}
