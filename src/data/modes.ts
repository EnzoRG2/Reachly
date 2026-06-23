import { Train, Bus, Plane, Car } from 'lucide-react'
import type { ModeConfig, TransportMode } from '../types'

export const MODES: Record<TransportMode, ModeConfig> = {
  train: { label: 'Train',   color: '#F97316', bg: '#FFF7ED', border: '#FED7AA', Icon: Train },
  bus:   { label: 'Bus',     color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', Icon: Bus   },
  plane: { label: 'Avion',   color: '#0063DC', bg: '#EFF6FF', border: '#BFDBFE', Icon: Plane },
  car:   { label: 'Voiture', color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', Icon: Car   },
}
