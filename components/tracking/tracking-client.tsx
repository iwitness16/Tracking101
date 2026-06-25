'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/reveal'
import {
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  Ship,
  User,
  Weight,
} from 'lucide-react'
import type { TrackingShipment } from '@/lib/shipments'

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

function PartyCard({
  title,
  party,
}: {
  title: string
  party: { name: string; phone: string; email: string; address: string }
}) {
  const fields = [
    { icon: User, label: 'Name', value: party.name },
    { icon: Phone, label: 'Phone', value: party.phone },
    { icon: Mail, label: 'Email', value: party.email },
    { icon: MapPin, label: 'Address', value: party.address },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-4 flex items-center gap-2 font-semibold">
        <User className="size-4 text-primary" />
        {title}
      </p>
      <dl className="space-y-3">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium text-foreground break-words">
                {value?.trim() || 'N/A'}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function TrackingClient() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [shipment, setShipment] = useState<TrackingShipment | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cn = searchParams.get('cn')?.trim()
    if (cn) setQuery(cn.toUpperCase())
  }, [searchParams])

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setSearched(true)
    if (!query.trim()) {
      setShipment(null)
      return
    }

    setLoading(true)
    try {
      const consignment = query.trim().toUpperCase()
      const res = await fetch(`/api/tracking/${encodeURIComponent(consignment)}`)
      if (!res.ok) {
        setShipment(null)
      } else {
        const body = (await res.json()) as { shipment: TrackingShipment }
        setShipment(body.shipment)
      }
    } catch {
      setShipment(null)
    } finally {
      setLoading(false)
    }
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
              placeholder="Enter your consignment number (e.g. ASL123456789012-CARGO)"
              className="h-12 pl-11 text-base"
              aria-label="Consignment number"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 gap-2" disabled={loading}>
            <Search className="size-4" />
            {loading ? 'Tracking...' : 'Track'}
          </Button>
        </form>
      </Reveal>

      {!shipment && (
        <div className="mt-6 text-center">
          {searched && query.trim().length === 0 ? (
            <p className="text-destructive">Please enter a consignment number.</p>
          ) : (
            <p className="text-muted-foreground">
              Enter your consignment number to see live status, route map, and shipment details.
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
                    {shipment.consignmentNumber}
                  </p>
                </div>
                <Badge className="gap-1.5 bg-primary/15 text-primary hover:bg-primary/15">
                  <Ship className="size-3.5" />
                  {shipment.status}
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
                    className="h-full rounded-full bg-primary transition-all duration-1000"
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Ship, label: 'Delivery mode', value: shipment.deliveryMode },
              {
                icon: Weight,
                label: 'Actual weight',
                value: `${(shipment.metrics?.totalActualWeightKg ?? shipment.cargo.weightKg).toFixed(2)} kg`,
              },
              {
                icon: Package,
                label: 'Pieces',
                value: `${shipment.cargo.quantity || shipment.packageItems?.reduce((s, p) => s + p.qty, 0) || 0} package(s)`,
              },
              {
                icon: Package,
                label: 'Shipment type',
                value: shipment.typeOfShipment || 'N/A',
              },
            ].map((d, i) => (
              <Reveal key={d.label} delay={i * 80}>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
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
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-primary" />
                    </span>
                    Real-time projection
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
                  <Clock className="size-4 text-primary" />
                  Shipment history
                </p>
                <ol className="mt-5 flex flex-col">
                  {shipment.history.map((ev, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {i === shipment.history.length - 1 ? (
                          <span className="relative flex size-5 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                            <CheckCircle2 className="relative size-5 text-primary" />
                          </span>
                        ) : (
                          <CheckCircle2 className="size-5 text-primary" />
                        )}
                        {i < shipment.history.length - 1 && (
                          <span className="my-1 w-0.5 flex-1 bg-primary/20" />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-medium text-card-foreground">{ev.status}</p>
                        <p className="text-xs text-muted-foreground">{ev.location}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {new Date(ev.timestamp).toLocaleString()}
                        </p>
                        {ev.remark && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {ev.remark}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <PartyCard title="Sender (Shipper)" party={shipment.shipper} />
            </Reveal>
            <Reveal delay={80}>
              <PartyCard title="Receiver" party={shipment.receiver} />
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-3 flex items-center gap-2 font-semibold">
                  <FileText className="size-4 text-primary" />
                  Shipment Details
                </p>
                <p className="text-sm text-muted-foreground">
                  Product:{' '}
                  <span className="font-medium text-foreground">
                    {shipment.cargo.product}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Carrier Ref Number:{' '}
                  <span className="font-medium text-foreground">
                    {shipment.carrierRefNumber || 'N/A'}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Remarks: <span className="font-medium text-foreground">{shipment.remarks || 'N/A'}</span>
                </p>
                {(shipment.route.pickupDate || shipment.route.pickupTime) && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pickup:{' '}
                    <span className="font-medium text-foreground">
                      {[shipment.route.pickupDate, shipment.route.pickupTime]
                        .filter(Boolean)
                        .join(' at ')}
                    </span>
                  </p>
                )}
            </div>
          </Reveal>

          {shipment.metrics && (
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <p className="mb-3 font-semibold">Cargo Metrics</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <p className="text-sm">
                    Total Volumetric Weight:{' '}
                    <span className="font-medium text-foreground">
                      {shipment.metrics.totalVolumetricWeightKg.toFixed(2)} kg
                    </span>
                  </p>
                  <p className="text-sm">
                    Total Volume:{' '}
                    <span className="font-medium text-foreground">
                      {shipment.metrics.totalVolumeCubicM.toFixed(2)} cu. m.
                    </span>
                  </p>
                  <p className="text-sm">
                    Total Actual Weight:{' '}
                    <span className="font-medium text-foreground">
                      {shipment.metrics.totalActualWeightKg.toFixed(2)} kg
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      )}
    </div>
  )
}
