import type { TransportMode } from '../types'
import { MODES } from '../data/modes'

interface TransportBadgeProps {
  mode: TransportMode
  small?: boolean
}

export function TransportBadge({ mode, small = false }: TransportBadgeProps) {
  const m = MODES[mode]
  const Icon = m.Icon

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: small ? '2px 8px' : '4px 10px',
        borderRadius: 6,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
      }}
    >
      <Icon size={small ? 10 : 12} />
      {m.label}
    </span>
  )
}
