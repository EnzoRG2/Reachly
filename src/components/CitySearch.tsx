import { useState, useRef, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import type { CityResult } from '../types'
import { useGeocoder } from '../hooks/useGeocoder'

interface CitySearchProps {
  value: string
  onChange: (v: string) => void
  onSelect: (city: CityResult) => void
  placeholder?: string
  prefix?: React.ReactNode
  style?: React.CSSProperties
}

export function CitySearch({ value, onChange, onSelect, placeholder = 'Ville…', prefix, style }: CitySearchProps) {
  const [open, setOpen] = useState(false)
  const { results, loading } = useGeocoder(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      {/* Left adornment — label or spinner */}
      <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
        {loading
          ? <Loader2 size={13} color="#9CA3AF" style={{ animation: 'spin 0.8s linear infinite' }} />
          : prefix ?? <Search size={13} color="#9CA3AF" />
        }
      </div>

      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '9px 10px 9px 32px',
          borderRadius: 8, border: '1.5px solid #E5E7EB',
          fontSize: 13, fontFamily: 'inherit', outline: 'none',
          color: '#111827', background: '#F9FAFB', fontWeight: 500,
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#0063DC')}
        onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
      />

      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)', overflow: 'hidden',
        }}>
          {results.map((r, i) => (
            <button
              key={i}
              onMouseDown={(e) => { e.preventDefault(); onSelect(r); onChange(r.name); setOpen(false) }}
              style={{
                width: '100%', padding: '9px 14px', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', borderBottom: i < results.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F3EE')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{r.name}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                {r.displayName.split(', ').slice(1, 3).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  )
}
