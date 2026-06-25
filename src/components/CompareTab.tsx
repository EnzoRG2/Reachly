import { useState } from 'react'
import { ArrowLeftRight, Leaf, Share2, ArrowRight } from 'lucide-react'
import type { CityResult, Destination, TransportMode, SortKey, CompareOption } from '../types'
import { MODES } from '../data/modes'
import { DESTS, DEST_COLORS } from '../data/destinations'
import { buildCompareOptions } from '../utils/transport'
import { TransportCard } from './TransportCard'
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
  realTemp?: number
}

type ModeFilter = TransportMode | 'all'

function minPrice(opts: CompareOption[]): number {
  return Math.min(...opts.map((o) => o.price))
}

export function CompareTab({
  fromInput, onFromInputChange, onFromSelect,
  toInput, onToInputChange,
  selected, onSelectDest,
  scaledDests, activeModes, sortBy, onSortChange,
  onToast, onSwap, fromCity, realTemp,
}: CompareTabProps) {
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all')

  const allOptions = selected ? buildCompareOptions(selected, activeModes, sortBy) : []
  const compareOptions = modeFilter === 'all'
    ? allOptions
    : allOptions.filter((o) => o.mode === modeFilter)

  const lowestPrice = allOptions.length ? minPrice(allOptions) : null

  const destIdx = selected ? DESTS.findIndex((d) => d.id === selected.id) : -1
  const destColor = destIdx >= 0 ? DEST_COLORS[destIdx % DEST_COLORS.length] : '#0063DC'
  const tempDisplay = realTemp !== undefined ? `${realTemp}°C` : selected?.temp ?? ''

  const handleToChange = (v: string) => {
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

  const handleShare = () =>
    navigator.clipboard.writeText(window.location.href).then(() => onToast('🔗 Lien copié !'))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>

      {/* Search widget */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <CitySearch value={fromInput} onChange={onFromInputChange} onSelect={onFromSelect}
              placeholder="Ville de départ…"
              prefix={<span style={{ fontSize: 9, fontWeight: 800, color: '#0063DC', background: '#EFF6FF', padding: '1px 5px', borderRadius: 4 }}>DE</span>}
            />
            <CitySearch value={toInput} onChange={handleToChange} onSelect={handleToSelect}
              placeholder="Destination…"
              prefix={<span style={{ fontSize: 9, fontWeight: 800, color: '#16A34A', background: '#F0FDF4', padding: '1px 5px', borderRadius: 4 }}>À</span>}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={onSwap} style={iconBtn}><ArrowLeftRight size={14} /></button>
            <button onClick={handleShare} style={iconBtn}><Share2 size={14} /></button>
          </div>
        </div>

        {/* Quick picks */}
        <div style={{ display: 'flex', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
          {scaledDests.slice(0, 5).map((d) => (
            <button key={d.id} onClick={() => { onSelectDest(d); onToInputChange(d.name) }} style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.12s',
              background: selected?.id === d.id ? '#EFF6FF' : '#F9FAFB',
              border: `1.5px solid ${selected?.id === d.id ? '#0063DC' : '#F3F4F6'}`,
              color: selected?.id === d.id ? '#0063DC' : '#6B7280',
            }}>
              {d.emoji} {d.name}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Destination hero */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: `linear-gradient(135deg,${destColor}15,${destColor}30)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              }}>{selected.img}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', marginBottom: 3 }}>
                  ITINÉRAIRE
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', lineHeight: 1.1 }}>
                  {fromCity.name} → {selected.name}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                  {allOptions.length} façon{allOptions.length > 1 ? 's' : ''} d'y aller
                  {lowestPrice && <> · dès <strong style={{ color: '#111827' }}>€{lowestPrice}</strong></>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{tempDisplay}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF' }}>{selected.country}</div>
              </div>
            </div>
          </div>

          {/* Mode filter tabs */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 6, overflowX: 'auto' }}>
            {(['all', ...activeModes.filter((m) => allOptions.some((o) => o.mode === m))] as ModeFilter[]).map((f) => {
              const active = modeFilter === f
              const label = f === 'all' ? 'Tous' : MODES[f].label
              const color = f === 'all' ? '#111827' : MODES[f].color
              return (
                <button key={f} onClick={() => setModeFilter(f)} style={{
                  padding: '5px 14px', borderRadius: 20, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                  background: active ? (f === 'all' ? '#111827' : color) : '#F9FAFB',
                  color: active ? '#fff' : '#6B7280',
                  transition: 'all 0.14s', flexShrink: 0,
                }}>{label}</button>
              )
            })}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexShrink: 0 }}>
              {(['price', 'time'] as SortKey[]).map((k) => (
                <button key={k} onClick={() => onSortChange(k)} style={{
                  padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  background: sortBy === k ? '#EFF6FF' : 'transparent',
                  color: sortBy === k ? '#0063DC' : '#9CA3AF',
                  border: sortBy === k ? '1.5px solid #BFDBFE' : '1.5px solid transparent',
                }}>
                  {k === 'price' ? 'Prix' : 'Durée'}
                </button>
              ))}
            </div>
          </div>

          {/* Transport cards */}
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {compareOptions.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                Aucun transport pour ce filtre
              </div>
            ) : compareOptions.map((r, i) => (
              <TransportCard key={r.mode} mode={r.mode} data={r} dest={selected} from={fromCity.name}
                isBest={i === 0 && modeFilter === 'all'}
                isLowest={r.price === lowestPrice && i !== 0}
                onClick={() => onToast(`Redirection → ${MODES[r.mode].label} €${r.price} ✓`)}
              />
            ))}
          </div>

          {/* CO₂ chart */}
          <div style={{ margin: '0 14px 12px', background: '#F9FAFB', borderRadius: 12, padding: '14px 16px', border: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Leaf size={13} color="#16A34A" /> Impact CO₂
            </div>
            {allOptions.map((r) => {
              const m = MODES[r.mode]
              const maxCo2 = Math.max(...allOptions.map((x) => x.co2))
              const pct = Math.max(4, (r.co2 / maxCo2) * 100)
              const barColor = r.co2 < 5 ? '#16A34A' : r.co2 < 50 ? '#F97316' : '#EF4444'
              return (
                <div key={r.mode} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <m.Icon size={11} color={m.color} />
                  <div style={{ width: 48, fontSize: 10, color: '#6B7280' }}>{m.label}</div>
                  <div style={{ flex: 1, height: 5, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: 10, color: barColor, fontWeight: 700, minWidth: 42, textAlign: 'right' }}>
                    {r.co2} kg
                  </span>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          {allOptions.length > 0 && (() => {
            const best = allOptions[0]
            const BestIcon = MODES[best.mode].Icon
            return (
              <div style={{ padding: '0 14px 18px' }}>
                <button onClick={() => onToast(`Redirection → ${MODES[best.mode].label} €${best.price} ✓`)} style={{
                  width: '100%', padding: '13px', background: '#0063DC',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <BestIcon size={15} /> Réserver en {MODES[best.mode].label} — €{best.price} <ArrowRight size={14} />
                </button>
                <p style={{ textAlign: 'center', fontSize: 10, color: '#9CA3AF', margin: '7px 0 0' }}>
                  Données indicatives · prix estimés selon la distance
                </p>
              </div>
            )
          })()}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', padding: '24px', gap: 8 }}>
          <div style={{ fontSize: 48 }}>✈️</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#6B7280' }}>Où veux-tu aller ?</div>
          <div style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
            Cherche une destination ou clique<br />sur un pin dans la carte
          </div>
        </div>
      )}
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  flex: 1, width: 38, borderRadius: 8, border: '1.5px solid #F3F4F6',
  background: '#fff', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: '#6B7280',
}
