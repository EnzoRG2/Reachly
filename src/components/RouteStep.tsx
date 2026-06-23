import type { TransportMode } from '../types'
import { MODES } from '../data/modes'

interface RouteStepProps {
  mode: TransportMode
  op: string
  stops: number
}

export function RouteStep({ mode, op, stops }: RouteStepProps) {
  const m = MODES[mode]
  const Icon = m.Icon

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: m.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${m.border}`,
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={m.color} />
      </div>
      <div>
        <span style={{ fontWeight: 500 }}>{op}</span>
        {stops > 0 && (
          <span style={{ color: '#9CA3AF', marginLeft: 6, fontSize: 12 }}>
            · {stops} correspondance{stops > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
