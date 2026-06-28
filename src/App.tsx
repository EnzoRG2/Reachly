import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Bus, X, User } from 'lucide-react'
import type { Destination, TransportMode, SortKey, CityResult } from './types'
import { filterDestinations, scaleDestinations } from './utils/transport'
import { DESTS } from './data/destinations'
import { MODES } from './data/modes'
import { useWeatherBatch } from './hooks/useWeather'
import { CompareTab } from './components/CompareTab'
import { MapPanel } from './components/MapPanel'

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

  const [fromCity, setFromCity] = useState<CityResult>(LYON)
  const [fromInput, setFromInput] = useState('Lyon')
  const [toInput, setToInput] = useState(() => searchParams.get('to') ?? '')
  const [selected, setSelected] = useState<Destination | null>(null)
  const [activeModes, setActiveModes] = useState<TransportMode[]>(['train', 'bus', 'plane', 'car'])
  const [timeMax, setTimeMax] = useState(6)
  const [sortBy, setSortBy] = useState<SortKey>('price')
  const [toast, setToast] = useState<string | null>(null)

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
    () => filterDestinations(scaledDests, activeModes, 500, timeMax),
    [scaledDests, activeModes, timeMax],
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
    setSearchParams((p) => { p.set('from', fromCity.name); p.set('to', d.name); return p }, { replace: true })
  }, [fromCity.name, setSearchParams])

  const handleSwap = useCallback(() => {
    const prev = fromInput
    setFromInput(toInput)
    setToInput(prev)
    setFromCity(LYON)
  }, [fromInput, toInput])

  const handleClosePanel = useCallback(() => {
    setSelected(null)
    setSearchParams((p) => { p.delete('to'); return p }, { replace: true })
  }, [setSearchParams])

  const sliderPct = (timeMax / SLIDER_MAX) * 100

  return (
    <div style={{
      fontFamily: "'Inter',system-ui,sans-serif",
      fontSize: 14, WebkitFontSmoothing: 'antialiased',
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      background: '#F1F5F9',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={{
        background: '#2563EB',
        padding: '0 20px', display: 'flex', alignItems: 'center', gap: 16,
        height: 56, flexShrink: 0, zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'rgba(255,255,255,0.20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '-0.5px',
          }}>R</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.5px' }}>Reachly</span>
        </div>

        <nav style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
          {[
            { id: 'explorer', label: 'Explorer', active: !selected },
            { id: 'trajets', label: 'Trajets', active: false },
            { id: 'inspiration', label: 'Inspiration', active: false },
            { id: 'favoris', label: 'Favoris', active: false },
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.id === 'explorer' ? handleClosePanel : undefined}
              style={{
                padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13,
                fontWeight: item.active ? 700 : 500,
                background: item.active ? '#fff' : 'transparent',
                color: item.active ? '#2563EB' : 'rgba(255,255,255,0.75)',
                transition: 'all 0.14s',
              }}
            >{item.label}</button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 20, padding: '5px 14px',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block', opacity: 0.85 }} />
            DÉPART · {fromCity.name}
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <User size={15} color="#fff" />
          </div>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Map — always full width within its flex area */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <MapPanel
            activeModes={activeModes}
            visibleDests={visibleDests}
            selected={selected}
            timeMax={timeMax}
            budget={500}
            fromCity={fromCity}
            onSelectDest={handleSelectDest}
          />

          {/* Floating time slider */}
          <div style={{
            position: 'absolute', top: 16, left: 0, right: 0,
            marginLeft: 'auto', marginRight: 'auto',
            background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)',
            border: '1px solid #E5E7EB', borderRadius: 16,
            padding: '12px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
            zIndex: 30, display: 'flex', flexDirection: 'column', gap: 10,
            width: isMobile ? 260 : 380,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                Temps de trajet maximum
              </span>
              <div style={{
                background: '#2563EB', color: '#fff',
                borderRadius: 20, padding: '3px 10px',
                fontSize: 12, fontWeight: 800, letterSpacing: '-0.3px',
              }}>
                {formatTimeLabel(timeMax)}
              </div>
            </div>

            <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 5,
                background: '#E5E7EB', borderRadius: 4, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${sliderPct}%`,
                  background: 'linear-gradient(90deg,#2563EB,#60A5FA)',
                  borderRadius: 4, transition: 'width 0.12s',
                }} />
              </div>
              <div style={{
                position: 'absolute',
                left: `calc(${sliderPct}% - 10px)`,
                top: '50%', transform: 'translateY(-50%)',
                width: 20, height: 20,
                background: '#fff', borderRadius: '50%',
                border: '2px solid #F97316',
                boxShadow: '0 1px 4px rgba(249,115,22,0.30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none', zIndex: 1,
              }}>
                <Bus size={10} color="#F97316" />
              </div>
              <input type="range" min="1" max={SLIDER_MAX} step="1" value={timeMax}
                onChange={(e) => setTimeMax(Number(e.target.value))}
                style={{
                  position: 'absolute', left: 0, right: 0, width: '100%',
                  opacity: 0, cursor: 'pointer', height: 24, margin: 0, padding: 0, zIndex: 2,
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -4 }}>
              {[0, 2, 4, 6, 8, 10, 12].map((h) => (
                <button key={h} onClick={() => h > 0 && setTimeMax(h)} style={{
                  fontSize: 10, fontWeight: timeMax === h ? 700 : 400,
                  color: timeMax === h ? '#2563EB' : '#D1D5DB',
                  background: 'none', border: 'none', cursor: h > 0 ? 'pointer' : 'default',
                  padding: '1px 0', fontFamily: 'inherit',
                }}>{h}h</button>
              ))}
            </div>
          </div>

          {/* Mode filter pills */}
          <div style={{
            position: 'absolute', top: 130, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 6,
            zIndex: 30, pointerEvents: 'none',
          }}>
            {(Object.entries(MODES) as [TransportMode, typeof MODES[TransportMode]][]).map(([k, v]) => {
              const Icon = v.Icon
              const active = activeModes.includes(k)
              return (
                <button key={k} onClick={() => toggleMode(k)} style={{
                  pointerEvents: 'auto',
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '5px 12px', borderRadius: 20,
                  border: `1.5px solid ${active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)'}`,
                  background: active ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(8px)',
                  color: active ? v.color : '#6B7280',
                  cursor: 'pointer', fontSize: 11, fontWeight: 700,
                  fontFamily: 'inherit', transition: 'all 0.14s',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.10)' : 'none',
                }}>
                  <Icon size={11} />{v.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right panel — appears only when a destination is selected */}
        {selected && (
          <div style={{
            width: isMobile ? '100%' : 420,
            flexShrink: 0,
            background: '#fff',
            borderLeft: '1px solid #E5E7EB',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            position: isMobile ? 'absolute' : 'relative',
            ...(isMobile ? { right: 0, top: 0, bottom: 0, zIndex: 50 } : {}),
            boxShadow: '-4px 0 24px rgba(0,0,0,0.07)',
          }}>
            <button onClick={handleClosePanel} style={{
              position: 'absolute', top: 12, right: 12, zIndex: 10,
              width: 28, height: 28, borderRadius: '50%',
              background: '#F3F4F6', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={14} color="#6B7280" />
            </button>
            <CompareTab
              fromInput={fromInput} onFromInputChange={setFromInput} onFromSelect={handleFromSelect}
              toInput={toInput} onToInputChange={setToInput}
              selected={selected} onSelectDest={setSelected}
              scaledDests={scaledDests}
              activeModes={activeModes}
              sortBy={sortBy} onSortChange={setSortBy}
              onToast={showToast} onSwap={handleSwap}
              fromCity={fromCity}
              realTemp={realTemps[selected.id]}
            />
          </div>
        )}
      </div>

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
