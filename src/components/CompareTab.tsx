import { Search, ArrowLeftRight, Leaf, TrendingDown, Zap, ArrowRight } from 'lucide-react'
import type { Destination, TransportMode, SortKey } from '../types'
import { MODES } from '../data/modes'
import { DESTS, DEST_COLORS } from '../data/destinations'
import { buildCompareOptions } from '../utils/transport'
import { TransportCard } from './TransportCard'
import { TransportBadge } from './TransportBadge'

interface CompareTabProps {
  from: string
  onFromChange: (v: string) => void
  toSearch: string
  onToSearchChange: (v: string) => void
  selected: Destination | null
  onSelectDest: (d: Destination) => void
  activeModes: TransportMode[]
  sortBy: SortKey
  onSortChange: (s: SortKey) => void
  onToast: (msg: string) => void
  onSwap: () => void
}

export function CompareTab({
  from, onFromChange,
  toSearch, onToSearchChange,
  selected, onSelectDest,
  activeModes,
  sortBy, onSortChange,
  onToast,
  onSwap,
}: CompareTabProps) {
  const compareOptions = selected ? buildCompareOptions(selected, activeModes, sortBy) : []
  const lowestPrice = compareOptions.length ? Math.min(...compareOptions.map((o) => o.price)) : null
  const fastestTime = compareOptions.length ? Math.min(...compareOptions.map((o) => parseFloat(o.time))) : null

  const destIdx = selected ? DESTS.findIndex((d) => d.id === selected.id) : -1
  const destColor = destIdx >= 0 ? DEST_COLORS[destIdx % DEST_COLORS.length] : '#0063DC'

  const handleSearch = () => {
    const found = DESTS.find((d) =>
      d.name.toLowerCase().includes(toSearch.toLowerCase()),
    )
    if (found) {
      onSelectDest(found)
      onToSearchChange(found.name)
    } else if (toSearch) {
      onToast('Destination pas encore disponible 🔜')
    }
  }

  return (
    <div>
      {/* Search widget */}
      <div style={{ background: '#fff', padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', maxWidth: 600 }}>
          {/* From */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 10,
                fontWeight: 700,
                color: '#0063DC',
                background: '#EFF6FF',
                padding: '1px 6px',
                borderRadius: 4,
              }}
            >
              DE
            </div>
            <input
              value={from}
              onChange={(e) => onFromChange(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 10px 11px 46px',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                fontSize: 13,
                fontFamily: 'inherit',
                fontWeight: 600,
                color: '#111827',
                outline: 'none',
                background: '#F9FAFB',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Swap */}
          <button
            onClick={onSwap}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #E5E7EB',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#6B7280',
            }}
          >
            <ArrowLeftRight size={14} />
          </button>

          {/* To */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 10,
                fontWeight: 700,
                color: '#16A34A',
                background: '#F0FDF4',
                padding: '1px 6px',
                borderRadius: 4,
              }}
            >
              À
            </div>
            <input
              list="dest-opts"
              value={toSearch}
              onChange={(e) => {
                onToSearchChange(e.target.value)
                const found = DESTS.find(
                  (d) => d.name.toLowerCase() === e.target.value.toLowerCase(),
                )
                if (found) onSelectDest(found)
              }}
              placeholder="Destination…"
              style={{
                width: '100%',
                padding: '11px 10px 11px 42px',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                fontSize: 13,
                fontFamily: 'inherit',
                fontWeight: 600,
                color: '#111827',
                outline: 'none',
                background: '#F9FAFB',
                boxSizing: 'border-box',
              }}
            />
            <datalist id="dest-opts">
              {DESTS.map((d) => <option key={d.id} value={d.name} />)}
            </datalist>
          </div>

          <button
            onClick={handleSearch}
            style={{
              padding: '11px 18px',
              background: '#0063DC',
              color: '#fff',
              borderRadius: 10,
              border: 'none',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Search size={14} /> Chercher
          </button>
        </div>

        {/* Quick picks */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#9CA3AF', padding: '5px 0', alignSelf: 'center' }}>
            Populaires :
          </span>
          {DESTS.slice(0, 6).map((d) => (
            <button
              key={d.id}
              onClick={() => { onSelectDest(d); onToSearchChange(d.name) }}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: selected?.id === d.id ? '#EFF6FF' : '#F9FAFB',
                border: selected?.id === d.id ? '1px solid #0063DC' : '1px solid #E5E7EB',
                color: selected?.id === d.id ? '#0063DC' : '#374151',
                fontWeight: 500,
              }}
            >
              {d.emoji} {d.name}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div style={{ padding: '16px 20px' }}>
          {/* Destination header */}
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: '16px 20px',
              marginBottom: 16,
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `linear-gradient(135deg,${destColor}15,${destColor}30)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                flexShrink: 0,
              }}
            >
              {selected.img}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
                {selected.emoji} {selected.name}
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                {selected.country} · {selected.desc}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>{selected.temp}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>actuellement</div>
            </div>
          </div>

          {/* Sort bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                {from} → {selected.name}
              </span>
              <span style={{ marginLeft: 8, fontSize: 12, color: '#6B7280' }}>
                {compareOptions.length} option{compareOptions.length > 1 ? 's' : ''}
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {k === 'price' ? <TrendingDown size={11} /> : <Zap size={11} />}
                  {k === 'price' ? 'Prix' : 'Durée'}
                </button>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          {compareOptions.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                {
                  label: 'Plus économique',
                  value: `${lowestPrice}€`,
                  sub: compareOptions.find((o) => o.price === lowestPrice)?.mode,
                  icon: '💰',
                },
                {
                  label: 'Plus rapide',
                  value: `${fastestTime}h`,
                  sub: compareOptions.find((o) => parseFloat(o.time) === fastestTime)?.mode,
                  icon: '⚡',
                },
                {
                  label: 'Plus écologique',
                  value: `${Math.min(...compareOptions.map((o) => o.co2))} kg`,
                  sub: undefined,
                  icon: '🌱',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    background: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: 12,
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>
                    {s.icon} {s.label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{s.value}</div>
                  {s.sub && MODES[s.sub] && <TransportBadge mode={s.sub} small />}
                </div>
              ))}
            </div>
          )}

          {/* Transport cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {compareOptions.length === 0 ? (
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '32px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  border: '1px solid #E5E7EB',
                }}
              >
                Aucun transport actif pour cette destination
              </div>
            ) : (
              compareOptions.map((r, i) => (
                <TransportCard
                  key={r.mode}
                  mode={r.mode}
                  data={r}
                  dest={selected}
                  from={from}
                  isBest={i === 0}
                  isLowest={r.price === lowestPrice && i !== 0}
                  onClick={() => onToast(`Redirection vers ${MODES[r.mode].label} — ${r.price}€ ✓`)}
                />
              ))
            )}
          </div>

          {/* CO2 chart */}
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: '16px 20px',
              marginTop: 14,
              border: '1px solid #E5E7EB',
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#111827',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Leaf size={14} color="#16A34A" /> Impact CO₂ comparé
            </div>
            {compareOptions.map((r) => {
              const m = MODES[r.mode]
              const Icon = m.Icon
              const maxCo2 = Math.max(...compareOptions.map((x) => x.co2))
              const pct = Math.max(4, (r.co2 / maxCo2) * 100)
              const good = r.co2 < 5
              const barColor = good ? '#16A34A' : r.co2 < 50 ? '#F97316' : '#EF4444'

              return (
                <div key={r.mode} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 60, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <Icon size={13} color={m.color} />
                    <span style={{ fontSize: 11, color: '#6B7280' }}>{m.label}</span>
                  </div>
                  <div style={{ flex: 1, height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: barColor,
                        borderRadius: 4,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: barColor,
                      fontWeight: 600,
                      minWidth: 46,
                      textAlign: 'right',
                    }}
                  >
                    {good ? '🌿' : '💨'} {r.co2} kg
                  </span>
                </div>
              )
            })}
          </div>

          {/* Book CTA */}
          {compareOptions.length > 0 && (() => {
            const best = compareOptions[0]
            const BestIcon = MODES[best.mode].Icon
            return (
              <button
                onClick={() => onToast(`Redirection partenaire — ${MODES[best.mode].label} ${best.price}€ ✓`)}
                style={{
                  width: '100%',
                  padding: '15px',
                  marginTop: 14,
                  background: '#0063DC',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <BestIcon size={16} />
                Réserver en {MODES[best.mode].label} — {best.price}€
                <ArrowRight size={16} />
              </button>
            )
          })()}

          <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
            Prix indicatifs · Redirection vers l'opérateur · Affiliation Reachly
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9CA3AF' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Où veux-tu aller ?
          </div>
          <div style={{ fontSize: 13 }}>
            Cherche une destination ou clique sur une ville dans Explorer
          </div>
        </div>
      )}
    </div>
  )
}
