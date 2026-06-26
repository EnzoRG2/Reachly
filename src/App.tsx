import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Map } from 'lucide-react'
import type { Destination, TransportMode, SortKey, CityResult } from './types'
import { filterDestinations, scaleDestinations } from './utils/transport'
import { DESTS } from './data/destinations'
import { useWeatherBatch } from './hooks/useWeather'
import { ExploreTab } from './components/ExploreTab'
import { CompareTab } from './components/CompareTab'
import { MapPanel } from './components/MapPanel'

type Tab = 'explore' | 'compare'

const LYON: CityResult = { name: 'Lyon', displayName: 'Lyon, France', lat: 45.764, lng: 4.8357 }

const SLIDER_MAX = 12

function formatTimeLabel(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return `${hrs}h${mins > 0 ? String(mins).padStart(2, '0') : '00'}`
}

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

  const realTemps = useWeatherBatch(DESTS)

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

  const sliderPct = (timeMax / SLIDER_MAX) * 100

  return (
    <div style={{
      fontFamily: "'Inter',system-ui,sans-serif",
      fontSize: 14, WebkitFontSmoothing: 'antialiased',
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      background: '#F9FAFB',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #F3F4F6',
        padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12,
        height: 54, flexShrink: 0, zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg,#16A34A,#22C55E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '-0.5px',
            boxShadow: '0 2px 8px rgba(22,163,74,0.35)',
          }}>R</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#111827', letterSpacing: '-0.5px' }}>Reachly</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '2px 7px', borderRadius: 20, border: '1px solid #BBF7D0' }}>BETA</span>
        </div>

        {/* Nav tabs */}
        <nav style={{ display: 'flex', gap: 3, marginLeft: 12 }}>
          {([['explore', '🗺️ Explorer'], ['compare', '⚡ Comparer']] as [Tab, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTabWithUrl(id)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12,
              fontWeight: tab === id ? 700 : 500,
              background: tab === id ? '#F0FDF4' : 'transparent',
              color: tab === id ? '#16A34A' : '#6B7280',
              transition: 'all 0.14s',
            }}>{label}</button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Mobile map toggle */}
        {isMobile ? (
          <button onClick={() => setShowMap((v) => !v)} style={{
            padding: '6px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB',
            background: showMap ? '#F0FDF4' : '#fff',
            color: showMap ? '#16A34A' : '#6B7280', fontFamily: 'inherit',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Map size={13} /> Carte
          </button>
        ) : (
          /* DÉPART pill */
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: '#F9FAFB', border: '1.5px solid #E5E7EB',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 11, fontWeight: 700, color: '#374151',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
            DÉPART {fromCity.name.toUpperCase()}
          </div>
        )}
      </header>

      {/* ── DISCLAIMER ───────────────────────────────────────── */}
      <div style={{
        background: '#FFFBEB', borderBottom: '1px solid #FDE68A',
        padding: '5px 20px', display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: '#92400E', flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700 }}>⚠ Prix estimés</span>
        <span style={{ color: '#B45309' }}>· Données indicatives basées sur la distance. Vérifiez les tarifs réels avant de réserver.</span>
      </div>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* Map — LEFT on desktop, toggleable on mobile */}
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

            {/* Floating time slider — Explorer tab only */}
            {tab === 'explore' && (
              <div style={{
                position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)',
                border: '1px solid #E5E7EB', borderRadius: 16,
                padding: '12px 20px', boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
                zIndex: 30, display: 'flex', flexDirection: 'column', gap: 10,
                minWidth: isMobile ? 250 : 300,
              }}>
                {/* Label + time pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                    Temps de trajet maximum
                  </span>
                  <div style={{
                    background: '#16A34A', color: '#fff',
                    borderRadius: 20, padding: '3px 10px',
                    fontSize: 12, fontWeight: 800, letterSpacing: '-0.3px',
                  }}>
                    {formatTimeLabel(timeMax)}
                  </div>
                </div>

                {/* Track with gradient fill */}
                <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 5,
                    background: '#E5E7EB', borderRadius: 4, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: `${sliderPct}%`,
                      background: 'linear-gradient(90deg,#16A34A,#22C55E)',
                      borderRadius: 4, transition: 'width 0.15s',
                    }} />
                  </div>
                  <input type="range" min="1" max={SLIDER_MAX} step="1" value={timeMax}
                    onChange={(e) => setTimeMax(Number(e.target.value))}
                    style={{
                      position: 'absolute', left: 0, right: 0, width: '100%',
                      opacity: 0, cursor: 'pointer', height: 20, margin: 0, padding: 0,
                    }}
                  />
                </div>

                {/* Quick marks */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -6 }}>
                  {[2, 4, 6, 8, 10, 12].map((h) => (
                    <button key={h} onClick={() => setTimeMax(h)} style={{
                      fontSize: 10, fontWeight: timeMax === h ? 700 : 400,
                      color: timeMax === h ? '#16A34A' : '#D1D5DB',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '1px 2px', fontFamily: 'inherit',
                    }}>{h}h</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panel — RIGHT on desktop */}
        {(!isMobile || !showMap) && (
          <div style={{
            width: isMobile ? '100%' : 400,
            flexShrink: 0,
            background: '#fff',
            borderLeft: isMobile ? 'none' : '1px solid #F3F4F6',
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
                realTemps={realTemps}
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
                realTemp={selected ? realTemps[selected.id] : undefined}
              />
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
