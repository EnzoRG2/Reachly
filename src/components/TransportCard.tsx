import { useState } from 'react'
import { Clock, Leaf, ChevronRight } from 'lucide-react'
import type { Destination, TransportMode, TransportOption } from '../types'
import { MODES } from '../data/modes'
import { RouteStep } from './RouteStep'

interface TransportCardProps {
  mode: TransportMode
  data: TransportOption
  dest: Destination
  from: string
  isBest: boolean
  isLowest: boolean
  onClick: () => void
}

export function TransportCard({ mode, data, dest, from, isBest, isLowest, onClick }: TransportCardProps) {
  const [hovered, setHovered] = useState(false)
  const m = MODES[mode]
  const Icon = m.Icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        border: `1px solid ${isBest ? m.border : '#E5E7EB'}`,
        borderLeft: `4px solid ${m.color}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.18s',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {isBest && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 12,
            background: m.color,
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '0 0 6px 6px',
            letterSpacing: '0.03em',
          }}
        >
          ⭐ MEILLEUR
        </div>
      )}
      {isLowest && !isBest && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 12,
            background: '#16A34A',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '0 0 6px 6px',
          }}
        >
          💰 MOINS CHER
        </div>
      )}

      {/* Mode icon */}
      <div
        style={{
          width: 64,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 8px',
          background: m.bg,
          borderRight: `1px solid ${m.border}`,
          gap: 4,
        }}
      >
        <Icon size={24} color={m.color} />
        <span style={{ fontSize: 10, fontWeight: 600, color: m.color }}>{m.label}</span>
      </div>

      {/* Route */}
      <div style={{ flex: 1, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{from}</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: -4,
                  transform: 'translateX(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: m.color,
                }}
              />
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{dest.name}</span>
        </div>
        <RouteStep mode={mode} op={data.op} stops={data.stops} />
      </div>

      {/* Time + CO2 */}
      <div
        style={{
          padding: '14px 12px',
          textAlign: 'center',
          flexShrink: 0,
          borderLeft: '1px solid #F3F4F6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7280', marginBottom: 4 }}>
          <Clock size={12} />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{data.time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11 }}>
          <Leaf size={10} color={data.co2 < 5 ? '#16A34A' : '#F97316'} />
          <span style={{ color: data.co2 < 5 ? '#16A34A' : '#F97316', fontWeight: 500 }}>
            {data.co2} kg CO₂
          </span>
        </div>
      </div>

      {/* Price + CTA */}
      <div
        style={{
          padding: '14px 16px',
          textAlign: 'right',
          flexShrink: 0,
          borderLeft: '1px solid #F3F4F6',
          minWidth: 100,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
          {data.price}€
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>par personne</div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '7px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            background: isBest ? m.color : '#F3F4F6',
            color: isBest ? '#fff' : '#374151',
          }}
        >
          Voir <ChevronRight size={12} />
        </div>
      </div>
    </div>
  )
}
