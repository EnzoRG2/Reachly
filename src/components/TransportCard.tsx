import { useState } from 'react'
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

function co2Meta(kg: number): { label: string; color: string; bg: string } {
  if (kg < 5)  return { label: 'FAIBLE CO₂',  color: '#16A34A', bg: '#F0FDF4' }
  if (kg < 50) return { label: 'CO₂ MODÉRÉ',  color: '#D97706', bg: '#FFFBEB' }
  return        { label: 'CO₂ ÉLEVÉ',   color: '#DC2626', bg: '#FEF2F2' }
}

export function TransportCard({ mode, data, dest, from, isBest, isLowest, onClick }: TransportCardProps) {
  const [hovered, setHovered] = useState(false)
  const m = MODES[mode]
  const Icon = m.Icon
  const co2 = co2Meta(data.co2)
  const showBest = isBest
  const showLowest = isLowest && !isBest

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 14,
        border: `1px solid ${hovered ? '#E0E7FF' : '#F3F4F6'}`,
        boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.16s',
        transform: hovered ? 'translateY(-1px)' : 'none',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Header strip — mode label + badge */}
      <div style={{
        padding: '8px 14px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 10, fontWeight: 800, color: m.color,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{m.label}</span>
        {showBest && (
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#fff',
            background: m.color, padding: '2px 8px',
            borderRadius: 20, letterSpacing: '0.05em',
          }}>★ MEILLEUR</span>
        )}
        {showLowest && (
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#16A34A',
            background: '#F0FDF4', padding: '2px 8px',
            border: '1px solid #BBF7D0',
            borderRadius: 20, letterSpacing: '0.05em',
          }}>💰 MOINS CHER</span>
        )}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px 14px' }}>
        {/* Icon bubble */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${m.color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={m.color} />
        </div>

        {/* Operator + route */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
            {data.op}
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>
            {from} → {dest.name}
            {data.stops > 0 && (
              <span style={{ marginLeft: 6, color: '#D1D5DB', fontSize: 11 }}>
                · {data.stops} corresp.
              </span>
            )}
          </div>
        </div>

        {/* Price + time + CO₂ */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontSize: 24, fontWeight: 800, color: '#111827',
            letterSpacing: '-0.5px', lineHeight: 1,
          }}>€{data.price}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{data.time}</div>
          <div style={{
            marginTop: 5,
            display: 'inline-block',
            fontSize: 9, fontWeight: 700,
            color: co2.color, background: co2.bg,
            padding: '2px 7px', borderRadius: 4,
            letterSpacing: '0.04em',
          }}>{co2.label}</div>
        </div>
      </div>
    </div>
  )
}
