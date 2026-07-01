import { useState } from 'react'
import { Heart, ArrowLeftRight, Search } from 'lucide-react'
import type { CityResult, Destination, SortKey, TransportMode } from '../types'
import { MODES } from '../data/modes'
import { DEST_COLORS } from '../data/destinations'
import { getMinMode, parseHours } from '../utils/transport'
import { DestCard } from './DestCard'
import { CitySearch } from './CitySearch'

export type NavTab = 'explorer' | 'trajets' | 'inspiration' | 'favoris'

interface LeftSidebarProps {
  activeNav: NavTab
  fromInput: string
  onFromInputChange: (v: string) => void
  onFromSelect: (city: CityResult) => void
  activeModes: TransportMode[]
  onToggleMode: (m: TransportMode) => void
  timeMax: number
  sortBy: SortKey
  onSortChange: (s: SortKey) => void
  visibleDests: Destination[]
  selected: Destination | null
  onSelectDest: (d: Destination) => void
  realTemps?: Record<number, number>
}

interface ExplorerProps extends Omit<LeftSidebarProps, 'activeNav' | 'timeMax'> {}

function ExplorerContent({
  fromInput, onFromInputChange, onFromSelect,
  activeModes, onToggleMode,
  sortBy, onSortChange,
  visibleDests, selected, onSelectDest, realTemps,
}: ExplorerProps) {
  const sorted = [...visibleDests].sort((a, b) => {
    const ma = getMinMode(a, activeModes)
    const mb = getMinMode(b, activeModes)
    if (!ma || !mb) return 0
    return sortBy === 'price'
      ? (a[ma]?.price ?? 999) - (b[mb]?.price ?? 999)
      : parseHours(a[ma]?.time ?? '99h') - parseHours(b[mb]?.time ?? '99h')
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
        <CitySearch
          value={fromInput}
          onChange={onFromInputChange}
          onSelect={onFromSelect}
          placeholder="Ville de départ…"
        />
      </div>

      <div style={{ padding: '10px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(Object.entries(MODES) as [TransportMode, typeof MODES[TransportMode]][]).map(([k, v]) => {
          const Icon = v.Icon
          const active = activeModes.includes(k)
          return (
            <button key={k} onClick={() => onToggleMode(k)} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 12px', borderRadius: 20,
              border: 'none', cursor: 'pointer',
              background: active ? v.color : '#F3F4F6',
              color: active ? '#fff' : '#9CA3AF',
              fontSize: 11, fontWeight: 700,
              fontFamily: 'inherit', transition: 'all 0.14s',
              boxShadow: active ? `0 2px 6px ${v.color}50` : 'none',
            }}>
              <Icon size={11} />{v.label}
            </button>
          )
        })}
      </div>

      <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Destinations</span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#2563EB',
            background: '#EFF6FF', padding: '1px 8px', borderRadius: 20,
          }}>{visibleDests.length}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['price', 'time'] as const).map((k) => (
            <button key={k} onClick={() => onSortChange(k)} style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              background: sortBy === k ? '#EFF6FF' : 'transparent',
              color: sortBy === k ? '#2563EB' : '#9CA3AF',
              border: sortBy === k ? '1px solid #BFDBFE' : '1px solid #F3F4F6',
            }}>
              {k === 'price' ? '€ Prix' : '⏱ Temps'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 16px' }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 12 }}>Aucune destination.<br />Augmente la durée max.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {sorted.map((d, i) => (
              <DestCard
                key={d.id} dest={d}
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

function TrajetsContent({ fromInput, onFromInputChange, onFromSelect }: Pick<LeftSidebarProps, 'fromInput' | 'onFromInputChange' | 'onFromSelect'>) {
  const [toInput, setToInput] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Rechercher un trajet</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CitySearch value={fromInput} onChange={onFromInputChange} onSelect={onFromSelect} placeholder="Départ…" />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#F3F4F6', border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <ArrowLeftRight size={12} color="#6B7280" />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              placeholder="Destination…"
              style={{
                width: '100%', padding: '9px 10px 9px 32px',
                borderRadius: 8, border: '1.5px solid #E5E7EB',
                fontSize: 13, fontFamily: 'inherit', outline: 'none',
                color: '#111827', background: '#F9FAFB', fontWeight: 500,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button style={{
            padding: '10px', borderRadius: 10, border: 'none',
            background: '#2563EB', color: '#fff',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Rechercher
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: '#9CA3AF', padding: 24 }}>
        <ArrowLeftRight size={32} strokeWidth={1.5} color="#D1D5DB" />
        <div style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.6, color: '#9CA3AF' }}>
          Ou cliquez sur une destination<br />sur la carte pour comparer<br />les trajets disponibles.
        </div>
      </div>
    </div>
  )
}

function InspirationContent({ visibleDests, activeModes, onSelectDest, realTemps }: Pick<LeftSidebarProps, 'visibleDests' | 'activeModes' | 'onSelectDest' | 'realTemps'>) {
  const featured = [...visibleDests]
    .sort((a, b) => {
      const ma = getMinMode(a, activeModes)
      const mb = getMinMode(b, activeModes)
      return (a[ma ?? 'train']?.price ?? 999) - (b[mb ?? 'train']?.price ?? 999)
    })
    .slice(0, 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Coups de cœur</div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Meilleures destinations du moment</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 16px' }}>
        {featured.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 12 }}>
            Ajuste les filtres pour voir des destinations.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {featured.map((d, i) => (
              <DestCard key={d.id} dest={d}
                color={DEST_COLORS[i % DEST_COLORS.length]}
                activeModes={activeModes}
                selected={false}
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

function FavorisContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Heart size={24} color="#F87171" strokeWidth={1.5} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Aucun favori</div>
        <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6 }}>
          Cliquez sur une destination<br />et ajoutez-la à vos favoris<br />pour la retrouver ici.
        </div>
      </div>
    </div>
  )
}

export function LeftSidebar({
  activeNav,
  fromInput, onFromInputChange, onFromSelect,
  activeModes, onToggleMode,
  sortBy, onSortChange,
  visibleDests, selected, onSelectDest, realTemps,
}: LeftSidebarProps) {
  return (
    <div style={{
      width: 320, flexShrink: 0,
      background: '#fff',
      borderRight: '1px solid #E5E7EB',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
    }}>
      {activeNav === 'explorer' && (
        <ExplorerContent
          fromInput={fromInput} onFromInputChange={onFromInputChange} onFromSelect={onFromSelect}
          activeModes={activeModes} onToggleMode={onToggleMode}
          sortBy={sortBy} onSortChange={onSortChange}
          visibleDests={visibleDests} selected={selected} onSelectDest={onSelectDest}
          realTemps={realTemps}
        />
      )}
      {activeNav === 'trajets' && (
        <TrajetsContent
          fromInput={fromInput} onFromInputChange={onFromInputChange} onFromSelect={onFromSelect}
        />
      )}
      {activeNav === 'inspiration' && (
        <InspirationContent
          visibleDests={visibleDests} activeModes={activeModes}
          onSelectDest={onSelectDest} realTemps={realTemps}
        />
      )}
      {activeNav === 'favoris' && <FavorisContent />}
    </div>
  )
}
