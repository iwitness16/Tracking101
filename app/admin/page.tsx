import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { OnTimeChart, VolumeChart } from '@/components/admin/dashboard-charts'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { adminShipments } from '@/lib/data'
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package,
  Timer,
  Truck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'AtlasSwift Logistics operations dashboard.',
}

const kpis = [
  {
    icon: Package,
    label: 'Active Shipments',
    value: '2,847',
    delta: '+12.4%',
    up: true,
  },
  {
    icon: Truck,
    label: 'In Transit',
    value: '1,932',
    delta: '+8.1%',
    up: true,
  },
  {
    icon: Timer,
    label: 'On-Time Rate',
    value: '99.1%',
    delta: '+0.6%',
    up: true,
  },
  {
    icon: DollarSign,
    label: 'Revenue (MTD)',
    value: '$4.82M',
    delta: '-2.3%',
    up: false,
  },
]

const statusStyles: Record<string, string> = {
  Delivered: 'bg-accent/15 text-accent',
  'In Transit': 'bg-primary/10 text-primary',
  'Out for Delivery': 'bg-primary/10 text-primary',
  Customs: 'bg-muted text-muted-foreground',
  Delayed: 'bg-destructive/10 text-destructive',
}

export default function AdminPage() {
  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-sans text-2xl font-bold text-foreground">
            Operations Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time overview of your global logistics network.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-accent">
                  <kpi.icon className="size-5" />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-sm font-medium ${
                    kpi.up ? 'text-accent' : 'text-destructive'
                  }`}
                >
                  {kpi.up ? (
                    <ArrowUpRight className="size-4" />
                  ) : (
                    <ArrowDownRight className="size-4" />
                  )}
                  {kpi.delta}
                </span>
              </div>
              <p className="mt-4 font-sans text-2xl font-bold text-card-foreground">
                {kpi.value}
              </p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-3">
            <div className="mb-4">
              <h2 className="font-sans font-semibold text-card-foreground">
                Shipment Volume
              </h2>
              <p className="text-sm text-muted-foreground">
                Monthly shipments by service type
              </p>
            </div>
            <VolumeChart />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
            <div className="mb-4">
              <h2 className="font-sans font-semibold text-card-foreground">
                On-Time Performance
              </h2>
              <p className="text-sm text-muted-foreground">Last 6 weeks</p>
            </div>
            <OnTimeChart />
          </div>
        </div>

        {/* Recent shipments */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-sans font-semibold text-card-foreground">
                Recent Shipments
              </h2>
              <p className="text-sm text-muted-foreground">
                Latest activity across all lanes
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminShipments.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-card-foreground">
                      {s.id}
                    </TableCell>
                    <TableCell>{s.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{s.route}</TableCell>
                    <TableCell>{s.service}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusStyles[s.status] ?? 'bg-secondary text-foreground'} hover:opacity-90`}
                      >
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{s.eta}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
