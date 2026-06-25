import { useState } from 'react'
import { Clock } from 'lucide-react'
import type { Destination, TransportMode } from '../types'
import { getMinMode } from '../utils/transport'
import { MODES } from '../data/modes'

interface DestCardProps {
  dest: Destination
  color: string
  activeModes: TransportMode[]
  selected: boolean
  realTemp?: number
  onClick: () => void
}

export function DestCard({ dest, color, activeModes, selected, realTemp, onClick }: DestCardProps) {
  const [hovered, setHovered] = useState(false)
  const bestMode = getMinMode(dest, activeModes)
  const bestData = bestMode ? dest[bestMode] : null
  const m = bestMode ? MODES[bestMode] : null
  const tempDisplay = realTemp !== undefined ? `${realTemp}°C` : dest.temp

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        border: selected ? `2px solid #0063DC` : '1px solid #F3F4F6',
        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'all 0.18s ease',
      }}
    >
      {/* Image area */}
      <div style={{
        height: 90,
        background: `linear-gradient(135deg, ${color}14, ${color}28)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 42, position: 'relative',
      }}>
        {dest.img}

        {/* Country badge */}
        <div style={{
          position: 'absolute', top: 7, left: 7,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 20, padding: '2px 7px',
          fontSize: 10, fontWeight: 600, color: '#374151',
          boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        }}>
          {dest.emoji} {dest.country}
        </div>

        {/* Temp badge */}
        <div style={{
          position: 'absolute', top: 7, right: 7,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 20, padding: '2px 7px',
          fontSize: 10, fontWeight: 700, color: '#374151',
          boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        }}>
          {tempDisplay}
        </div>

        {/* Price pill */}
        {bestData && (
          <div style={{
            position: 'absolute', bottom: 7, right: 7,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 8, padding: '3px 8px',
            fontSize: 12, fontWeight: 800, color: '#111827',
            boxShadow: '0 2px 6px rgba(0,0,0,0.09)',
          }}>
            dès €{bestData.price}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 11px 11px' }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#111827', marginBottom: 6, letterSpacing: '-0.2px' }}>
          {dest.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {m ? (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 10, fontWeight: 700, color: m.color,
              background: m.bg, border: `1px solid ${m.border}`,
              padding: '2px 7px', borderRadius: 20,
            }}>
              <m.Icon size={9} />{m.label}
            </span>
          ) : <span />}
          {bestData && (
            <span style={{ fontSize: 10, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={9} />{bestData.time}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
