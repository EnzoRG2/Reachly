import type { LucideIcon } from 'lucide-react'

export interface TransportOption {
  time: string
  price: number
  op: string
  stops: number
  co2: number
}

export interface Destination {
  id: number
  name: string
  country: string
  code: string
  emoji: string
  img: string
  temp: string
  lat: number
  lng: number
  desc: string
  train: TransportOption | null
  bus: TransportOption | null
  plane: TransportOption | null
  car: TransportOption | null
}

export interface CityResult {
  name: string
  displayName: string
  lat: number
  lng: number
}

export type TransportMode = 'train' | 'bus' | 'plane' | 'car'

export interface ModeConfig {
  label: string
  color: string
  bg: string
  border: string
  Icon: LucideIcon
}

export type SortKey = 'price' | 'time'

export interface CompareOption extends TransportOption {
  mode: TransportMode
}
