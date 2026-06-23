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
  onClick: () => void
}

export function DestCard({ dest, color, activeModes, selected, onClick }: DestCardProps) {
  const [hovered, setHovered] = useState(false)
  const bestMode = getMinMode(dest, activeModes)
  const bestData = bestMode ? dest[bestMode] : null
  const m = bestMode ? MODES[bestMode] : null

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        border: selected ? `2px solid #0063DC` : '1px solid #E5E7EB',
        boxShadow: hovered
          ? '0 8px 24px rgba(0,0,0,0.12)'
          : '0 1px 6px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Zone image — grand emoji sur gradient pastel */}
      <div style={{
        height: 100,
        background: `linear-gradient(135deg, ${color}18, ${color}32)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 46,
        position: 'relative',
      }}>
        {dest.img}

        {/* Badge pays — haut gauche */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 20, padding: '2px 7px',
          fontSize: 10, fontWeight: 600, color: '#374151',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          {dest.emoji} {dest.country}
        </div>

        {/* Prix pill — bas droite */}
        {bestData && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 8, padding: '3px 8px',
            fontSize: 12, fontWeight: 700, color: '#111827',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            dès {bestData.price}€
          </div>
        )}
      </div>

      {/* Info bas de la card */}
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{
          fontWeight: 800, fontSize: 14, color: '#111827',
          marginBottom: 6, letterSpacing: '-0.3px',
        }}>
          {dest.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {m && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 10, fontWeight: 700, color: m.color,
              background: m.bg, border: `1px solid ${m.border}`,
              padding: '2px 7px', borderRadius: 20,
              letterSpacing: '0.02em',
            }}>
              <m.Icon size={9} />{m.label}
            </span>
          )}
          {bestData && (
            <span style={{
              fontSize: 10, color: '#9CA3AF',
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <Clock size={9} />{bestData.time}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
