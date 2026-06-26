import { SlidersHorizontal, Clock } from 'lucide-react'
import type { CityResult, Destination, TransportMode, SortKey } from '../types'
import { MODES } from '../data/modes'
import { DEST_COLORS } from '../data/destinations'
import { getMinMode, filterDestinations, parseHours } from '../utils/transport'
import { DestCard } from './DestCard'
import { CitySearch } from './CitySearch'

interface ExploreTabProps {
  fromInput: string
  onFromInputChange: (v: string) => void
  onFromSelect: (city: CityResult) => void
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
  scaledDests: Destination[]
  realTemps?: Record<number, number>
}

export function ExploreTab({
  fromInput, onFromInputChange, onFromSelect,
  activeModes, onToggleMode,
  timeMax, onTimeMaxChange,
  budget, onBudgetChange,
  showFilters, onToggleFilters,
  sortBy, onSortChange,
  selected, onSelectDest,
  scaledDests, realTemps,
}: ExploreTabProps) {
  const visible = filterDestinations(scaledDests, activeModes, budget, timeMax)

  const sorted = [...visible].sort((a, b) => {
    const ma = getMinMode(a, activeModes)
    const mb = getMinMode(b, activeModes)
    if (!ma || !mb) return 0
    return sortBy === 'price'
      ? a[ma]!.price - b[mb]!.price
      : parseHours(a[ma]!.time) - parseHours(b[mb]!.time)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F5F3EE' }}>

      {/* Departure search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', background: '#fff' }}>
        <CitySearch
          value={fromInput}
          onChange={onFromInputChange}
          onSelect={onFromSelect}
          placeholder="Ville de départ…"
        />
      </div>

      {/* Mode pills */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #E5E7EB', background: '#fff', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {(Object.entries(MODES) as [TransportMode, typeof MODES[TransportMode]][]).map(([k, v]) => {
          const Icon = v.Icon
          const active = activeModes.includes(k)
          return (
            <button key={k} onClick={() => onToggleMode(k)} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 11px', borderRadius: 20,
              border: `1.5px solid ${active ? '#BFDBFE' : '#E5E7EB'}`,
              background: active ? '#EFF6FF' : '#fff',
              color: active ? '#0063DC' : '#6B7280',
              cursor: 'pointer', fontSize: 11, fontWeight: 700,
              fontFamily: 'inherit', transition: 'all 0.14s',
            }}>
              <Icon size={11} />{v.label}
            </button>
          )
        })}
        <button onClick={onToggleFilters} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 11px', borderRadius: 20,
          border: `1.5px solid ${showFilters ? '#BFDBFE' : '#E5E7EB'}`,
          background: showFilters ? '#EFF6FF' : '#fff',
          color: showFilters ? '#0063DC' : '#6B7280',
          cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
        }}>
          <SlidersHorizontal size={11} /> Budget
        </button>
      </div>

      {/* Time slider — always visible */}
      <div style={{ padding: '10px 16px', background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Clock size={11} color="#16A34A" />
        <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', flexShrink: 0 }}>Durée max</span>
        <div style={{ flex: 1, position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(timeMax / 12) * 100}%`, background: 'linear-gradient(90deg,#16A34A,#22C55E)', borderRadius: 3 }} />
          </div>
          <input type="range" min="1" max="12" step="1" value={timeMax}
            onChange={(e) => onTimeMaxChange(Number(e.target.value))}
            style={{ position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0, padding: 0 }}
          />
        </div>
        <span style={{
          fontSize: 12, fontWeight: 800, color: '#fff',
          background: '#16A34A', borderRadius: 20, padding: '2px 9px', flexShrink: 0,
        }}>{timeMax}h</span>
      </div>

      {/* Budget filter */}
      {showFilters && (
        <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Budget max</label>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0063DC' }}>{budget}€</span>
          </div>
          <input type="range" min="20" max="300" step="10" value={budget}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#0063DC' }} />
        </div>
      )}

      {/* Grid header */}
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Destinations</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#0063DC',
            background: '#EFF6FF', padding: '1px 8px', borderRadius: 20, border: '1px solid #BFDBFE',
          }}>{visible.length}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['price', 'time'] as const).map((k) => (
            <button key={k} onClick={() => onSortChange(k)} style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s',
              background: sortBy === k ? '#EFF6FF' : 'transparent',
              color: sortBy === k ? '#0063DC' : '#6B7280',
              border: sortBy === k ? '1.5px solid #BFDBFE' : '1.5px solid #E5E7EB',
            }}>
              {k === 'price' ? '💰 Prix' : '⏱ Temps'}
            </button>
          ))}
        </div>
      </div>

      {/* 2-column grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 13 }}>Aucune destination.<br />Augmente le budget ou la durée.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {sorted.map((d, i) => (
              <DestCard key={d.id} dest={d}
                color={DEST_COLORS[i % DEST_COLORS.length]}
                activeModes={activeModes}
                selected={selected?.id === d.id}
                realTemp={realTemps?.[d.id]}
                onClick={() => onSelectDest(d)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
