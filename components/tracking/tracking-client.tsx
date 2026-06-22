'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/reveal'
import { demoShipment, type Shipment } from '@/lib/data'
import {
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Package,
  Search,
  Ship,
  Truck,
  Weight,
} from 'lucide-react'

const RouteMap = dynamic(
  () => import('@/components/tracking/route-map').then((m) => m.RouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-secondary">
        <span className="text-sm text-muted-foreground">Loading live map…</span>
      </div>
    ),
  },
)

export function TrackingClient() {
  const [query, setQuery] = useState('')
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [searched, setSearched] = useState(false)

  function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setSearched(true)
    // No backend — always returns the demo shipment for any non-empty input
    if (query.trim().length > 0) {
      setShipment({ ...demoShipment, trackingId: query.trim().toUpperCase() })
    } else {
      setShipment(null)
    }
  }

  function loadDemo() {
    setQuery(demoShipment.trackingId)
    setShipment(demoShipment)
    setSearched(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Search */}
      <Reveal>
        <form
          onSubmit={handleTrack}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your tracking number (e.g. ASL-7783-2049-XK)"
              className="h-12 pl-11 text-base"
              aria-label="Tracking number"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 gap-2">
            <Search className="size-4" />
            Track
          </Button>
        </form>
      </Reveal>

      {!shipment && (
        <div className="mt-6 text-center">
          {searched && query.trim().length === 0 ? (
            <p className="text-destructive">Please enter a tracking number.</p>
          ) : (
            <p className="text-muted-foreground">
              Don’t have one handy?{' '}
              <button
                type="button"
                onClick={loadDemo}
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Try a demo shipment
              </button>
            </p>
          )}
        </div>
      )}

      {shipment && (
        <div className="mt-8 flex flex-col gap-6">
          {/* Summary bar */}
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking number</p>
                  <p className="font-sans text-xl font-bold text-card-foreground">
                    {shipment.trackingId}
                  </p>
                </div>
                <Badge className="gap-1.5 bg-accent/15 text-accent hover:bg-accent/15">
                  <Ship className="size-3.5" />
                  {shipment.statusLabel}
                </Badge>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-card-foreground">
                    <MapPin className="size-4 text-accent" />
                    {shipment.origin.city}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-card-foreground">
                    {shipment.destination.city}
                    <MapPin className="size-4 text-muted-foreground" />
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-1000"
                    style={{ width: `${shipment.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Estimated delivery{' '}
                  <span className="font-semibold text-card-foreground">
                    {shipment.estimatedDelivery}
                  </span>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Details grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Truck, label: 'Service', value: shipment.service },
              { icon: Weight, label: 'Weight', value: shipment.weight },
              {
                icon: Package,
                label: 'Pieces',
                value: `${shipment.pieces} container(s)`,
              },
            ].map((d, i) => (
              <Reveal key={d.label} delay={i * 80}>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-accent">
                    <d.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{d.label}</p>
                    <p className="font-medium text-card-foreground">{d.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Map + timeline */}
          <div className="grid gap-6 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <div className="overflow-hidden rounded-2xl border border-border">
                <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
                  <p className="flex items-center gap-2 font-sans font-semibold text-card-foreground">
                    <MapPin className="size-4 text-accent" />
                    Live route
                  </p>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-accent" />
                    </span>
                    Updated 4 min ago
                  </span>
                </div>
                <div className="h-[420px] w-full">
                  <RouteMap shipment={shipment} />
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-2" delay={120}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <p className="flex items-center gap-2 font-sans font-semibold text-card-foreground">
                  <Clock className="size-4 text-accent" />
                  Shipment history
                </p>
                <ol className="mt-5 flex flex-col">
                  {shipment.events.map((ev, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {ev.current ? (
                          <span className="relative flex size-5 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                            <CheckCircle2 className="relative size-5 text-accent" />
                          </span>
                        ) : ev.done ? (
                          <CheckCircle2 className="size-5 text-accent" />
                        ) : (
                          <Circle className="size-5 text-muted-foreground/40" />
                        )}
                        {i < shipment.events.length - 1 && (
                          <span
                            className={`my-1 w-0.5 flex-1 ${
                              ev.done ? 'bg-accent/40' : 'bg-border'
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <p
                          className={`text-sm font-medium ${
                            ev.done || ev.current
                              ? 'text-card-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {ev.status}
                        </p>
                        <p className="text-xs text-muted-foreground">{ev.location}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {ev.timestamp}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </div>
  )
}
