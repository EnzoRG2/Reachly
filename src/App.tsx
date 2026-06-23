import { useState, useCallback } from 'react'
import { MapPin as MapPinIcon } from 'lucide-react'
import type { Destination, TransportMode, SortKey } from './types'
import { ExploreTab } from './components/ExploreTab'
import { CompareTab } from './components/CompareTab'

type Tab = 'explore' | 'compare'

const TABS = [
  { id: 'explore' as Tab, label: '🗺️  Explorer' },
  { id: 'compare' as Tab, label: '⚡  Comparer' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('explore')
  const [from, setFrom] = useState('Lyon')
  const [toSearch, setToSearch] = useState('')
  const [selected, setSelected] = useState<Destination | null>(null)
  const [activeModes, setActiveModes] = useState<TransportMode[]>(['train', 'bus', 'plane', 'car'])
  const [timeMax, setTimeMax] = useState(5)
  const [budget, setBudget] = useState(150)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>('price')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  const toggleMode = useCallback((m: TransportMode) => {
    setActiveModes((prev) =>
      prev.includes(m)
        ? prev.length > 1 ? prev.filter((x) => x !== m) : prev
        : [...prev, m],
    )
  }, [])

  const handleSelectDest = useCallback((d: Destination) => {
    setSelected(d)
    setToSearch(d.name)
    setTab('compare')
  }, [])

  const handleSwap = useCallback(() => {
    setFrom(toSearch || '')
    setToSearch(from)
  }, [from, toSearch])

  return (
    <div
      style={{
        fontFamily: "'Inter',system-ui,sans-serif",
        background: '#F5F7FA',
        minHeight: '100vh',
        fontSize: 14,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0055C8 0%,#0077EE 100%)', padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 12px' }}>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.5px' }}>
                Reachly
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              BETA
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPinIcon size={12} /> Lyon, France
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 20px 14px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '10px 10px 0 0',
                background: tab === t.id ? '#F5F7FA' : 'rgba(255,255,255,0.12)',
                color: tab === t.id ? '#0055C8' : 'rgba(255,255,255,0.85)',
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: 13,
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === 'explore' && (
        <ExploreTab
          from={from}
          onFromChange={setFrom}
          activeModes={activeModes}
          onToggleMode={toggleMode}
          timeMax={timeMax}
          onTimeMaxChange={setTimeMax}
          budget={budget}
          onBudgetChange={setBudget}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selected={selected}
          onSelectDest={handleSelectDest}
        />
      )}

      {tab === 'compare' && (
        <CompareTab
          from={from}
          onFromChange={setFrom}
          toSearch={toSearch}
          onToSearchChange={setToSearch}
          selected={selected}
          onSelectDest={setSelected}
          activeModes={activeModes}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onToast={showToast}
          onSwap={handleSwap}
        />
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px',
          fontSize: 11,
          color: '#9CA3AF',
          borderTop: '1px solid #E5E7EB',
          background: '#fff',
        }}
      >
        Reachly · MVP v0.1 · Données simulées · Powered by ❤️
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111827',
            color: '#fff',
            padding: '11px 20px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 200,
            animation: 'fadein 0.25s ease-out',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}
