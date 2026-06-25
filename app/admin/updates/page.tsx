import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { listShipments } from '@/lib/shipments'

export const metadata: Metadata = {
  title: 'Update Shipments',
  description: 'Search and publish shipment updates.',
}

export default async function AdminUpdatesPage() {
  const shipments = await listShipments()
  return (
    <AdminShell>
      <AdminDashboard initialShipments={shipments} mode="update" />
    </AdminShell>
  )
}

