'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { TrackingShipment } from '@/lib/shipments'

function makeIcon(color: string, pulse = false) {
  return L.divIcon({
    className: 'asl-marker',
    html: `<span style="
      display:flex;align-items:center;justify-content:center;
      width:18px;height:18px;border-radius:9999px;
      background:${color};border:3px solid #fff;
      box-shadow:0 0 0 ${pulse ? '6px' : '0px'} ${color}40;
      ${pulse ? 'animation: aslpulse 1.8s ease-out infinite;' : ''}
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

// Build a curved great-circle-ish arc between two points
function buildArc(
  from: [number, number],
  to: [number, number],
  segments = 64,
): [number, number][] {
  const [lat1, lon1] = from
  const [lat2, lon2] = to
  const points: [number, number][] = []
  const offset = Math.min(Math.abs(lon2 - lon1), Math.abs(lat2 - lat1)) * 0.25 + 6
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const lat = lat1 + (lat2 - lat1) * t
    const lon = lon1 + (lon2 - lon1) * t
    const curve = Math.sin(Math.PI * t) * offset
    points.push([lat + curve, lon])
  }
  return points
}

export function RouteMap({ shipment }: { shipment: TrackingShipment }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    })
    mapRef.current = map

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      },
    ).addTo(map)

    const origin = shipment.origin.coords
    const dest = shipment.destination.coords
    const current = shipment.current.coords

    const fullArc = buildArc(origin, dest)
    // Split arc into completed vs remaining based on progress
    const splitIdx = Math.floor((shipment.progress / 100) * fullArc.length)
    const completed = fullArc.slice(0, splitIdx + 1)
    const remaining = fullArc.slice(splitIdx)

    L.polyline(remaining, {
      color: '#94a3b8',
      weight: 2,
      opacity: 0.5,
      dashArray: '6 8',
    }).addTo(map)

    L.polyline(completed, {
      color: '#dc2626',
      weight: 3,
      opacity: 0.95,
    }).addTo(map)

    L.marker(origin, { icon: makeIcon('#16a34a') })
      .addTo(map)
      .bindPopup(`<b>Origin</b><br/>${shipment.origin.city}`)
    L.marker(dest, { icon: makeIcon('#64748b') })
      .addTo(map)
      .bindPopup(`<b>Destination</b><br/>${shipment.destination.city}`)
    L.marker(current, { icon: makeIcon('#dc2626', true) })
      .addTo(map)
      .bindPopup(`<b>Current location</b><br/>${shipment.current.city}`)
      .openPopup()

    const bounds = L.latLngBounds([origin, dest, current])
    map.fitBounds(bounds, { padding: [60, 60] })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [shipment])

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="application"
      aria-label={`Live route map for shipment ${shipment.consignmentNumber}`}
    />
  )
}
