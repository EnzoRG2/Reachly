import { Search, SlidersHorizontal, Clock, MapPin as MapPinIcon } from 'lucide-react'
import type { Destination, TransportMode, SortKey } from '../types'
import { MODES } from '../data/modes'
import { DESTS, DEST_COLORS } from '../data/destinations'
import { getMinMode, filterDestinations } from '../utils/transport'
import { MapPin } from './MapPin'
import { DestCard } from './DestCard'

interface ExploreTabProps {
  from: string
  onFromChange: (v: string) => void
  activeModes: TransportMode[]
  onToggleMode: (m: TransportMode) => void
  timeMax: number
  onTimeMaxChange: (v: number) => void
  budget: number
  onBudgetChange: (v: number) => void
  showFilters: boolean
  onToggleFilters: () => void
  sortBy: SortKey
  onSortChange: (s: SortKey) => void
  selected: Destination | null
  onSelectDest: (d: Destination) => void
}

export function ExploreTab({
  from, onFromChange,
  activeModes, onToggleMode,
  timeMax, onTimeMaxChange,
  budget, onBudgetChange,
  showFilters, onToggleFilters,
  sortBy, onSortChange,
  selected, onSelectDest,
}: ExploreTabProps) {
  const visible = filterDestinations(DESTS, activeModes, budget, timeMax)

  const sorted = [...visible].sort((a, b) => {
    const ma = getMinMode(a, activeModes)
    const mb = getMinMode(b, activeModes)
    if (!ma || !mb) return 0
    return sortBy === 'price'
      ? a[ma]!.price - b[mb]!.price
      : parseFloat(a[ma]!.time) - parseFloat(b[mb]!.time)
  })

  return (
    <div>
      {/* Search + mode toggles */}
      <div
        style={{
          background: '#fff',
          padding: '16px 20px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            placeholder="Depuis…"
            style={{
              width: '100%',
              padding: '9px 10px 9px 32px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              fontSize: 13,
              fontFamily: 'inherit',
              outline: 'none',
              color: '#111827',
              background: '#F9FAFB',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {(Object.entries(MODES) as [TransportMode, typeof MODES[TransportMode]][]).map(([k, v]) => {
            const Icon = v.Icon
            const active = activeModes.includes(k)
            return (
              <button
                key={k}
                onClick={() => onToggleMode(k)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: `1px solid ${active ? v.color : '#E5E7EB'}`,
                  background: active ? v.bg : '#fff',
                  color: active ? v.color : '#9CA3AF',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={13} />{v.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={onToggleFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 8,
            border: `1px solid ${showFilters ? '#0063DC' : '#E5E7EB'}`,
            background: showFilters ? '#EFF6FF' : '#fff',
            color: showFilters ? '#0063DC' : '#6B7280',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          <SlidersHorizontal size={13} /> Filtres
          <span
            style={{
              background: showFilters ? '#0063DC' : '#E5E7EB',
              color: showFilters ? '#fff' : '#6B7280',
              borderRadius: 20,
              padding: '1px 6px',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            2
          </span>
        </button>
      </div>

      {/* Filter sliders */}
      {showFilters && (
        <div
          style={{
            background: '#EFF6FF',
            borderBottom: '1px solid #BFDBFE',
            padding: '14px 20px',
            display: 'flex',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={12} color="#0063DC" /> Durée maximale
              </label>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0063DC' }}>{timeMax}h</span>
            </div>
            <input
              type="range" min="1" max="12" step="1" value={timeMax}
              onChange={(e) => onTimeMaxChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0063DC' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              <span>1h</span><span>12h</span>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>💰 Budget max</label>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0063DC' }}>{budget}€</span>
            </div>
            <input
              type="range" min="20" max="300" step="10" value={budget}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0063DC' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              <span>20€</span><span>300€</span>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div
        style={{
          margin: '16px 20px',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #E5E7EB',
          background: '#EBF5FF',
          position: 'relative',
          height: 340,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}
        >
          <rect width="100" height="100" fill="#DBEAFE" />
          <path d="M15,15 Q25,10 40,12 Q52,10 62,14 Q74,18 80,28 Q86,38 84,52 Q82,62 76,70 Q68,80 58,84 Q46,88 34,84 Q22,80 14,68 Q6,56 8,42 Q10,28 15,15Z" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="0.5" />
          <path d="M20,35 Q28,28 38,30 Q50,32 54,42 Q52,54 44,60 Q34,58 26,50 Q18,44 20,35Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="0.3" />
          <path d="M60,15 Q68,12 76,18 Q80,26 76,34 Q70,38 64,34 Q58,28 60,15Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="0.3" />
          {[20, 40, 60, 80].map((x) => (
            <line key={`vl${x}`} x1={x} y1="0" x2={x} y2="100" stroke="rgba(147,197,253,0.4)" strokeWidth="0.3" strokeDasharray="2,4" />
          ))}
          {[20, 40, 60, 80].map((y) => (
            <line key={`hl${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(147,197,253,0.4)" strokeWidth="0.3" strokeDasharray="2,4" />
          ))}
        </svg>

        {/* Lyon origin */}
        <div style={{ position: 'absolute', left: '38%', top: '46%', transform: 'translate(-50%,-50%)', zIndex: 15 }}>
          <div
            style={{
              background: '#0063DC',
              color: '#fff',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: '0 4px 12px rgba(0,99,220,0.4)',
            }}
          >
            <MapPinIcon size={11} /> Lyon
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 12,
              height: 12,
              background: '#0063DC',
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: '0 0 0 4px rgba(0,99,220,0.2)',
            }}
          />
        </div>

        {DESTS.map((d, i) => (
          <MapPin
            key={d.id}
            dest={d}
            color={DEST_COLORS[i % DEST_COLORS.length]}
            active={visible.includes(d)}
            activeModes={activeModes}
            onClick={() => onSelectDest(d)}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #E5E7EB',
            borderRadius: 10,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: '#374151',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {visible.length} destinations · {timeMax}h max · {budget}€ max
        </div>
      </div>

      {/* Destination grid */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Destinations accessibles</span>
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: '#0063DC',
                background: '#EFF6FF',
                padding: '2px 8px',
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {visible.length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {(['price', 'time'] as const).map((k) => (
              <button
                key={k}
                onClick={() => onSortChange(k)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: sortBy === k ? '#0063DC' : '#fff',
                  color: sortBy === k ? '#fff' : '#6B7280',
                  border: sortBy === k ? '1px solid #0063DC' : '1px solid #E5E7EB',
                }}
              >
                {k === 'price' ? '💰 Prix' : '⏱ Rapidité'}
              </button>
            ))}
          </div>
        </div>

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14 }}>
              Aucune destination avec ces filtres.<br />Augmente le budget ou la durée.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(175px,1fr))', gap: 12 }}>
            {sorted.map((d, i) => (
              <DestCard
                key={d.id}
                dest={d}
                color={DEST_COLORS[i % DEST_COLORS.length]}
                activeModes={activeModes}
                selected={selected?.id === d.id}
                onClick={() => onSelectDest(d)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
