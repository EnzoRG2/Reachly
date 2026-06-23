import { ArrowLeftRight, Leaf, TrendingDown, Zap, ArrowRight, Share2 } from 'lucide-react'
import type { CityResult, Destination, TransportMode, SortKey } from '../types'
import { MODES } from '../data/modes'
import { DESTS, DEST_COLORS } from '../data/destinations'
import { buildCompareOptions, parseHours } from '../utils/transport'
import { TransportCard } from './TransportCard'
import { TransportBadge } from './TransportBadge'
import { CitySearch } from './CitySearch'

interface CompareTabProps {
  fromInput: string
  onFromInputChange: (v: string) => void
  onFromSelect: (city: CityResult) => void
  toInput: string
  onToInputChange: (v: string) => void
  selected: Destination | null
  onSelectDest: (d: Destination | null) => void
  scaledDests: Destination[]
  activeModes: TransportMode[]
  sortBy: SortKey
  onSortChange: (s: SortKey) => void
  onToast: (msg: string) => void
  onSwap: () => void
  fromCity: CityResult
}

export function CompareTab({
  fromInput, onFromInputChange, onFromSelect,
  toInput, onToInputChange,
  selected, onSelectDest,
  scaledDests,
  activeModes, sortBy, onSortChange,
  onToast, onSwap, fromCity,
}: CompareTabProps) {
  const compareOptions = selected ? buildCompareOptions(selected, activeModes, sortBy) : []
  const lowestPrice = compareOptions.length ? Math.min(...compareOptions.map((o) => o.price)) : null
  const fastestOption = compareOptions.length
    ? compareOptions.reduce((a, b) => parseHours(a.time) < parseHours(b.time) ? a : b)
    : null

  const destIdx = selected ? DESTS.findIndex((d) => d.id === selected.id) : -1
  const destColor = destIdx >= 0 ? DEST_COLORS[destIdx % DEST_COLORS.length] : '#0063DC'

  const handleToSearch = (v: string) => {
    onToInputChange(v)
    const found = scaledDests.find((d) => d.name.toLowerCase() === v.toLowerCase())
    if (found) onSelectDest(found)
  }

  const handleToSelect = (city: CityResult) => {
    const found = scaledDests.find((d) =>
      d.name.toLowerCase() === city.name.toLowerCase() ||
      d.name.toLowerCase().startsWith(city.name.toLowerCase().slice(0, 4)),
    )
    if (found) { onSelectDest(found); onToInputChange(found.name) }
    else onToast('Destination pas encore disponible 🔜')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => onToast('🔗 Lien copié !'))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F5F3EE' }}>

      {/* Search widget */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', background: '#fff' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <CitySearch value={fromInput} onChange={onFromInputChange} onSelect={onFromSelect}
              placeholder="Ville de départ…"
              prefix={<span style={{ fontSize: 9, fontWeight: 800, color: '#0063DC', background: '#EFF6FF', padding: '1px 5px', borderRadius: 4 }}>DE</span>}
            />
            <CitySearch value={toInput} onChange={handleToSearch}
              onSelect={handleToSelect}
              placeholder="Destination…"
              prefix={<span style={{ fontSize: 9, fontWeight: 800, color: '#16A34A', background: '#F0FDF4', padding: '1px 5px', borderRadius: 4 }}>À</span>}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={onSwap} style={{
              flex: 1, width: 36, borderRadius: 8, border: '1.5px solid #E5E7EB',
              background: '#fff', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#6B7280',
            }}><ArrowLeftRight size={13} /></button>
            <button onClick={handleShare} style={{
              flex: 1, width: 36, borderRadius: 8, border: '1.5px solid #E5E7EB',
              background: '#fff', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#6B7280',
            }}><Share2 size={13} /></button>
          </div>
        </div>

        {/* Quick picks */}
        <div style={{ display: 'flex', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
          {scaledDests.slice(0, 5).map((d) => (
            <button key={d.id} onClick={() => { onSelectDest(d); onToInputChange(d.name) }} style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 500,
              background: selected?.id === d.id ? '#EFF6FF' : '#F5F3EE',
              border: `1.5px solid ${selected?.id === d.id ? '#0063DC' : '#E5E7EB'}`,
              color: selected?.id === d.id ? '#0063DC' : '#6B7280',
              transition: 'all 0.14s',
            }}>
              {d.emoji} {d.name}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Destination header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12, background: '#fff' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg,${destColor}18,${destColor}32)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            }}>{selected.img}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
                {selected.emoji} {selected.name}
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{selected.country} · {selected.desc.split('·')[0].trim()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{selected.temp}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>actuel</div>
            </div>
          </div>

          {/* Sort + count */}
          <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>
              {compareOptions.length} option{compareOptions.length > 1 ? 's' : ''} · {fromCity.name} → {selected.name}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['price', 'time'] as const).map((k) => (
                <button key={k} onClick={() => onSortChange(k)} style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 3,
                  background: sortBy === k ? '#EFF6FF' : 'transparent',
                  color: sortBy === k ? '#0063DC' : '#6B7280',
                  border: sortBy === k ? '1.5px solid #BFDBFE' : '1.5px solid #E5E7EB',
                }}>
                  {k === 'price' ? <TrendingDown size={10} /> : <Zap size={10} />}
                  {k === 'price' ? 'Prix' : 'Durée'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats pills */}
          {compareOptions.length > 0 && (
            <div style={{ display: 'flex', gap: 6, padding: '10px 16px', background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
              {[
                { label: 'Économique', value: `${lowestPrice}€`, mode: compareOptions.find((o) => o.price === lowestPrice)?.mode, icon: '💰' },
                { label: 'Rapide', value: fastestOption?.time ?? '–', mode: fastestOption?.mode, icon: '⚡' },
                { label: 'Écolo', value: `${Math.min(...compareOptions.map((o) => o.co2))} kg`, mode: undefined, icon: '🌱' },
              ].map((s) => (
                <div key={s.label} style={{
                  flex: 1, background: '#F9FAFB', border: '1px solid #E5E7EB',
                  borderRadius: 10, padding: '8px 10px',
                }}>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 3 }}>{s.icon} {s.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{s.value}</div>
                  {s.mode && MODES[s.mode] && <TransportBadge mode={s.mode} small />}
                </div>
              ))}
            </div>
          )}

          {/* Transport cards */}
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {compareOptions.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                Aucun transport actif
              </div>
            ) : compareOptions.map((r, i) => (
              <TransportCard key={r.mode} mode={r.mode} data={r} dest={selected} from={fromCity.name}
                isBest={i === 0}
                isLowest={r.price === lowestPrice && i !== 0}
                onClick={() => onToast(`Redirection → ${MODES[r.mode].label} ${r.price}€ ✓`)}
              />
            ))}
          </div>

          {/* CO₂ chart */}
          <div style={{ margin: '0 12px 12px', background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Leaf size={13} color="#16A34A" /> Impact CO₂ comparé
            </div>
            {compareOptions.map((r) => {
              const m = MODES[r.mode]
              const Icon = m.Icon
              const maxCo2 = Math.max(...compareOptions.map((x) => x.co2))
              const pct = Math.max(4, (r.co2 / maxCo2) * 100)
              const barColor = r.co2 < 5 ? '#16A34A' : r.co2 < 50 ? '#F97316' : '#EF4444'
              return (
                <div key={r.mode} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 52, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <Icon size={11} color={m.color} />
                    <span style={{ fontSize: 10, color: '#6B7280' }}>{m.label}</span>
                  </div>
                  <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: 10, color: barColor, fontWeight: 700, minWidth: 44, textAlign: 'right' }}>
                    {r.co2 < 5 ? '🌿' : '💨'} {r.co2} kg
                  </span>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          {compareOptions.length > 0 && (() => {
            const best = compareOptions[0]
            const BestIcon = MODES[best.mode].Icon
            return (
              <div style={{ padding: '0 12px 16px' }}>
                <button
                  onClick={() => onToast(`Redirection → ${MODES[best.mode].label} ${best.price}€ ✓`)}
                  style={{
                    width: '100%', padding: '13px', background: '#0063DC',
                    color: '#fff', border: 'none', borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8,
                  }}
                >
                  <BestIcon size={15} />
                  Réserver en {MODES[best.mode].label} — {best.price}€
                  <ArrowRight size={14} />
                </button>
                <p style={{ textAlign: 'center', fontSize: 10, color: '#9CA3AF', margin: '8px 0 0' }}>
                  Données indicatives · Prix approximatifs basés sur la distance réelle
                </p>
              </div>
            )
          })()}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', padding: '24px' }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>✈️</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>Où veux-tu aller ?</div>
          <div style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.5 }}>
            Cherche une destination ou clique sur un point dans la carte
          </div>
        </div>
      )}
    </div>
  )
}
