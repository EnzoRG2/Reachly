import { useState } from 'react'
import { Clock, Leaf, ChevronRight } from 'lucide-react'
import type { Destination, TransportMode, TransportOption } from '../types'
import { MODES } from '../data/modes'

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
  const isGreen = data.co2 < 5

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        background: '#ffffff',
        border: '1px solid #E5E7EB',
        borderLeft: `4px solid ${m.color}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 4px 16px rgba(0,0,0,0.10)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.16s, transform 0.16s',
        transform: hovered ? 'translateY(-1px)' : 'none',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Ribbon ⭐ MEILLEUR */}
      {isBest && (
        <div style={{
          position: 'absolute', top: 0, right: 10,
          background: m.color, color: '#fff',
          fontSize: 9, fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '0 0 6px 6px',
          letterSpacing: '0.05em',
        }}>
          ⭐ MEILLEUR
        </div>
      )}
      {isLowest && !isBest && (
        <div style={{
          position: 'absolute', top: 0, right: 10,
          background: '#16A34A', color: '#fff',
          fontSize: 9, fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '0 0 6px 6px',
          letterSpacing: '0.05em',
        }}>
          💰 MOINS CHER
        </div>
      )}

      {/* Colonne icône — fond teinté pastel 12% */}
      <div style={{
        width: 60, flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 4, padding: '14px 8px',
        background: `${m.color}1F`, // ~12% opacity hex
        borderRight: `1px solid ${m.color}30`,
      }}>
        <Icon size={22} color={m.color} />
        <span style={{
          fontSize: 9, fontWeight: 700, color: m.color,
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>{m.label}</span>
      </div>

      {/* Centre — opérateur + route */}
      <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{from}</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ flex: 1, height: 1.5, background: '#E5E7EB', borderRadius: 1 }} />
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1.5, background: '#E5E7EB', borderRadius: 1 }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{dest.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#6B7280' }}>{data.op}</span>
          {data.stops > 0 && (
            <span style={{
              fontSize: 10, color: '#9CA3AF',
              background: '#F3F4F6', padding: '1px 7px',
              borderRadius: 20, border: '1px solid #E5E7EB',
            }}>
              {data.stops} corresp.
            </span>
          )}
        </div>
      </div>

      {/* Durée + CO₂ */}
      <div style={{
        padding: '12px 10px', textAlign: 'center', flexShrink: 0,
        borderLeft: '1px solid #F3F4F6',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
          <Clock size={11} color="#9CA3AF" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{data.time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
          <Leaf size={9} color={isGreen ? '#16A34A' : '#F97316'} />
          <span style={{ fontSize: 10, color: isGreen ? '#16A34A' : '#F97316', fontWeight: 600 }}>
            {data.co2} kg
          </span>
        </div>
      </div>

      {/* Prix + CTA */}
      <div style={{
        padding: '12px 14px', textAlign: 'right', flexShrink: 0,
        borderLeft: '1px solid #F3F4F6', minWidth: 88,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 22, fontWeight: 800, color: '#111827',
          lineHeight: 1, letterSpacing: '-0.5px',
        }}>{data.price}€</div>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 8 }}>par pers.</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
          background: isBest ? m.color : '#F3F4F6',
          color: isBest ? '#fff' : '#6B7280',
        }}>
          Voir <ChevronRight size={11} />
        </div>
      </div>
    </div>
  )
}
