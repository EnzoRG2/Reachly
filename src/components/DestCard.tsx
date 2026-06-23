import { useState } from 'react'
import { Clock } from 'lucide-react'
import type { Destination, TransportMode } from '../types'
import { getMinMode } from '../utils/transport'
import { TransportBadge } from './TransportBadge'

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
        border: selected ? `2px solid ${color}` : '1px solid #E5E7EB',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : '0 1px 6px rgba(0,0,0,0.06)',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
      }}
    >
      {/* Image area */}
      <div
        style={{
          height: 110,
          background: `linear-gradient(135deg, ${color}15, ${color}30)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontSize: 52,
        }}
      >
        {dest.img}
        {bestData && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(4px)',
              borderRadius: 8,
              padding: '3px 8px',
              fontSize: 12,
              fontWeight: 700,
              color: '#111827',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            dès {bestData.price}€
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 20,
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 600,
            color: '#374151',
          }}
        >
          {dest.emoji} {dest.country}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>
          {dest.name}
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8, lineHeight: 1.4 }}>
          {dest.desc.split('·')[0].trim()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {bestMode && <TransportBadge mode={bestMode} small />}
          {bestData && (
            <span style={{ fontSize: 11, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} />
              {bestData.time}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
