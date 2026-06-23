import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin as MapPinIcon, Map } from 'lucide-react'
import type { Destination, TransportMode, SortKey, CityResult } from './types'
import { filterDestinations, scaleDestinations } from './utils/transport'
import { DESTS } from './data/destinations'
import { ExploreTab } from './components/ExploreTab'
import { CompareTab } from './components/CompareTab'
import { MapPanel } from './components/MapPanel'

type Tab = 'explore' | 'compare'

const TIME_MARKS = [2, 4, 6, 8, 10, 12]
const LYON: CityResult = { name: 'Lyon', displayName: 'Lyon, France', lat: 45.764, lng: 4.8357 }

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = useIsMobile()

  const [tab, setTab] = useState<Tab>(() => searchParams.get('to') ? 'compare' : 'explore')
  const [fromCity, setFromCity] = useState<CityResult>(LYON)
  const [fromInput, setFromInput] = useState('Lyon')
  const [toInput, setToInput] = useState(() => searchParams.get('to') ?? '')
  const [selected, setSelected] = useState<Destination | null>(null)
  const [activeModes, setActiveModes] = useState<TransportMode[]>(['train', 'bus', 'plane', 'car'])
  const [timeMax, setTimeMax] = useState(6)
  const [budget, setBudget] = useState(150)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>('price')
  const [toast, setToast] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  const scaledDests = useMemo(
    () => scaleDestinations(DESTS, fromCity.lat, fromCity.lng),
    [fromCity],
  )

  const visibleDests = useMemo(
    () => filterDestinations(scaledDests, activeModes, budget, timeMax),
    [scaledDests, activeModes, budget, timeMax],
  )

  const toggleMode = useCallback((m: TransportMode) => {
    setActiveModes((prev) =>
      prev.includes(m)
        ? prev.length > 1 ? prev.filter((x) => x !== m) : prev
        : [...prev, m],
    )
  }, [])

  const handleFromSelect = useCallback((city: CityResult) => {
    setFromCity(city)
    setFromInput(city.name)
    setSearchParams((p) => { p.set('from', city.name); return p }, { replace: true })
  }, [setSearchParams])

  const handleSelectDest = useCallback((d: Destination) => {
    setSelected(d)
    setToInput(d.name)
    setTab('compare')
    setShowMap(false)
    setSearchParams((p) => { p.set('from', fromCity.name); p.set('to', d.name); return p }, { replace: true })
  }, [fromCity.name, setSearchParams])

  const handleSwap = useCallback(() => {
    const prev = fromInput
    setFromInput(toInput)
    setToInput(prev)
    setFromCity(LYON)
  }, [fromInput, toInput])

  const setTabWithUrl = useCallback((t: Tab) => {
    setTab(t)
    if (t === 'explore') {
      setSearchParams((p) => { p.delete('to'); return p }, { replace: true })
    }
  }, [setSearchParams])

  return (
    <div style={{
      fontFamily: "'Inter',system-ui,sans-serif",
      fontSize: 14, WebkitFontSmoothing: 'antialiased',
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      background: '#F5F3EE',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={{
        background: 'linear-gradient(135deg, #0055C8, #0077EE)',
        padding: '0 16px', display: 'flex', alignItems: 'center', gap: 16,
        height: 52, flexShrink: 0, zIndex: 40,
      }}>
        <span style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.5px', flexShrink: 0 }}>Reachly</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#0063DC', background: '#fff', padding: '2px 7px', borderRadius: 20 }}>BETA</span>

        <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
          {([['explore', '🗺️ Explorer'], ['compare', '⚡ Comparer']] as [Tab, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTabWithUrl(id)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13,
              fontWeight: tab === id ? 700 : 500,
              background: tab === id ? '#fff' : 'rgba(255,255,255,0.15)',
              color: tab === id ? '#0063DC' : 'rgba(255,255,255,0.85)',
              transition: 'all 0.14s',
            }}>{label}</button>
          ))}
        </nav>

        {isMobile ? (
          <button onClick={() => setShowMap((v) => !v)} style={{
            padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: showMap ? '#fff' : 'rgba(255,255,255,0.15)',
            color: showMap ? '#0063DC' : '#fff', fontFamily: 'inherit',
            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Map size={13} /> Carte
          </button>
        ) : (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <MapPinIcon size={11} /> {fromCity.name}
          </div>
        )}
      </header>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* Left panel */}
        {(!isMobile || !showMap) && (
          <div style={{
            width: isMobile ? '100%' : 390,
            flexShrink: 0,
            background: '#F5F3EE',
            borderRight: isMobile ? 'none' : '1px solid #E5E7EB',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            flex: isMobile ? '1' : undefined,
          }}>
            {tab === 'explore' && (
              <ExploreTab
                fromInput={fromInput} onFromInputChange={setFromInput}
                onFromSelect={handleFromSelect}
                activeModes={activeModes} onToggleMode={toggleMode}
                timeMax={timeMax} onTimeMaxChange={setTimeMax}
                budget={budget} onBudgetChange={setBudget}
                showFilters={showFilters} onToggleFilters={() => setShowFilters((v) => !v)}
                sortBy={sortBy} onSortChange={setSortBy}
                selected={selected} onSelectDest={handleSelectDest}
                scaledDests={scaledDests}
              />
            )}
            {tab === 'compare' && (
              <CompareTab
                fromInput={fromInput} onFromInputChange={setFromInput} onFromSelect={handleFromSelect}
                toInput={toInput} onToInputChange={setToInput}
                selected={selected} onSelectDest={setSelected}
                scaledDests={scaledDests}
                activeModes={activeModes}
                sortBy={sortBy} onSortChange={setSortBy}
                onToast={showToast} onSwap={handleSwap}
                fromCity={fromCity}
              />
            )}
          </div>
        )}

        {/* Map panel */}
        {(!isMobile || showMap) && (
          <div style={{ flex: 1, position: 'relative', minHeight: isMobile ? 0 : undefined }}>
            <MapPanel
              activeModes={activeModes}
              visibleDests={visibleDests}
              selected={selected}
              timeMax={timeMax}
              budget={budget}
              fromCity={fromCity}
              onSelectDest={handleSelectDest}
            />

            {/* Floating time slider — Explorer only */}
            {tab === 'explore' && (
              <div style={{
                position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
                border: '1px solid #E5E7EB', borderRadius: 14,
                padding: '10px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                zIndex: 30, display: 'flex', flexDirection: 'column', gap: 8,
                minWidth: isMobile ? 260 : 310,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Temps de trajet max
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0063DC' }}>{timeMax}h</span>
                </div>
                <input type="range" min="1" max="12" step="1" value={timeMax}
                  onChange={(e) => setTimeMax(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0063DC', cursor: 'pointer', height: 4 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -4 }}>
                  {TIME_MARKS.map((h) => (
                    <button key={h} onClick={() => setTimeMax(h)} style={{
                      fontSize: 10, fontWeight: timeMax === h ? 700 : 500,
                      color: timeMax === h ? '#0063DC' : '#9CA3AF',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px 3px', fontFamily: 'inherit',
                    }}>{h}h</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#111827', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontSize: 13, fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 200,
          animation: 'fadein 0.2s ease-out', whiteSpace: 'nowrap',
        }}>{toast}</div>
      )}

      <style>{`
        @keyframes fadein { from { opacity:0; transform:translateX(-50%) translateY(8px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        * { box-sizing: border-box }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px }
      `}</style>
    </div>
  )
}
