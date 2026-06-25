'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  AdminInput,
  AdminSection,
  AdminSelect,
  adminFieldClass,
  adminTextareaClass,
  PackagesSection,
} from '@/components/admin/admin-form-primitives'
import { PAYMENT_MODES, SHIPMENT_TYPES } from '@/lib/shipment-options'
import {
  DELIVERY_MODES,
  makeConsignmentNumber,
  SHIPMENT_STATUSES,
  type PackageLineItem,
  type ShipmentRecord,
} from '@/lib/shipments'
import { Save, Search, Sparkles } from 'lucide-react'

type FormState = {
  consignmentNumber: string
  status: (typeof SHIPMENT_STATUSES)[number]
  deliveryMode: (typeof DELIVERY_MODES)[number]
  typeOfShipment: string
  carrierRefNumber: string
  route: {
    originLabel: string
    destinationLabel: string
    pickupDate: string
    pickupTime: string
    dispatchAt: string
    expectedDeliveryAt: string
    journeyProgressPercent: string
  }
  shipper: { name: string; phone: string; email: string; address: string }
  receiver: { name: string; phone: string; email: string; address: string }
  cargo: { product: string; weightKg: string; quantity: string }
  commercial: { paymentMode: string; totalFreight: string }
  packageItems: PackageLineItem[]
  remarks: string
  historyRemark: string
}

const EMPTY_STATE: FormState = {
  consignmentNumber: makeConsignmentNumber(),
  status: 'Pending',
  deliveryMode: 'Air freight',
  typeOfShipment: '',
  carrierRefNumber: '',
  route: {
    originLabel: '',
    destinationLabel: '',
    pickupDate: '',
    pickupTime: '',
    dispatchAt: '',
    expectedDeliveryAt: '',
    journeyProgressPercent: '0',
  },
  shipper: { name: '', phone: '', email: '', address: '' },
  receiver: { name: '', phone: '', email: '', address: '' },
  cargo: { product: '', weightKg: '0', quantity: '0' },
  commercial: { paymentMode: '', totalFreight: '0' },
  packageItems: [],
  remarks: '',
  historyRemark: '',
}

function toFormState(s: ShipmentRecord): FormState {
  return {
    consignmentNumber: s.consignmentNumber,
    status: s.status,
    deliveryMode: s.deliveryMode,
    typeOfShipment: s.typeOfShipment,
    carrierRefNumber: s.carrierRefNumber,
    route: {
      originLabel: s.route.originLabel,
      destinationLabel: s.route.destinationLabel,
      pickupDate: s.route.pickupDate || '',
      pickupTime: s.route.pickupTime || '',
      dispatchAt: s.route.dispatchAt.slice(0, 16),
      expectedDeliveryAt: s.route.expectedDeliveryAt.slice(0, 16),
      journeyProgressPercent: String(s.route.journeyProgressPercent),
    },
    shipper: { ...s.shipper },
    receiver: { ...s.receiver },
    cargo: {
      product: s.cargo.product,
      weightKg: String(s.cargo.weightKg),
      quantity: String(s.cargo.quantity),
    },
    commercial: {
      paymentMode: s.commercial.paymentMode,
      totalFreight: String(s.commercial.totalFreight),
    },
    packageItems: s.packageItems || [],
    remarks: s.remarks,
    historyRemark: '',
  }
}

export function AdminDashboard({
  initialShipments,
  mode = 'create',
}: {
  initialShipments: ShipmentRecord[]
  mode?: 'create' | 'update'
}) {
  const [shipments, setShipments] = useState(initialShipments)
  const [form, setForm] = useState<FormState>(EMPTY_STATE)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return shipments
    return shipments.filter((s) =>
      s.consignmentNumber.toLowerCase().includes(query.toLowerCase()),
    )
  }, [shipments, query])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateNested(
    key: 'route' | 'shipper' | 'receiver' | 'cargo' | 'commercial',
    field: string,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as object), [field]: value },
    }))
  }

  async function refreshList() {
    const res = await fetch('/api/admin/shipments', { cache: 'no-store' })
    if (!res.ok) return
    const body = (await res.json()) as { shipments: ShipmentRecord[] }
    setShipments(body.shipments)
  }

  async function saveShipment(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const payload = {
      consignmentNumber: form.consignmentNumber,
      status: form.status,
      deliveryMode: form.deliveryMode,
      typeOfShipment: form.typeOfShipment,
      carrierRefNumber: form.carrierRefNumber,
      route: {
        originLabel: form.route.originLabel,
        destinationLabel: form.route.destinationLabel,
        pickupDate: form.route.pickupDate,
        pickupTime: form.route.pickupTime,
        dispatchAt: form.route.dispatchAt,
        expectedDeliveryAt: form.route.expectedDeliveryAt,
        journeyProgressPercent: Number(form.route.journeyProgressPercent || 0),
      },
      shipper: { ...form.shipper },
      receiver: { ...form.receiver },
      cargo: {
        product: form.cargo.product,
        weightKg: Number(form.cargo.weightKg || 0),
        quantity: Number(form.cargo.quantity || 0),
      },
      packageItems: form.packageItems,
      commercial: {
        paymentMode: form.commercial.paymentMode,
        totalFreight: Number(form.commercial.totalFreight || 0),
      },
      remarks: form.remarks,
      historyRemark: form.historyRemark,
    }

    try {
      const url = editingId
        ? `/api/admin/shipments/${encodeURIComponent(form.consignmentNumber)}`
        : '/api/admin/shipments'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(body.error ?? 'Unable to save shipment.')
        return
      }
      setSuccess(
        editingId ? 'Shipment updated and published.' : 'Shipment created and published.',
      )
      setForm({ ...EMPTY_STATE, consignmentNumber: makeConsignmentNumber() })
      setEditingId(null)
      await refreshList()
    } catch {
      setError('Unexpected error while saving shipment.')
    } finally {
      setLoading(false)
    }
  }

  function editShipment(shipment: ShipmentRecord) {
    setEditingId(shipment.consignmentNumber)
    setError('')
    setSuccess('')
    setForm(toFormState(shipment))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Shipment Control Center
        </h1>
        <p className="mt-1 text-muted-foreground">
          {mode === 'create'
            ? 'Create shipment records with structured sections and publish directly.'
            : 'Find shipments and publish professional status updates from a dedicated workflow.'}
        </p>
      </div>

      {mode === 'update' && (
        <div className="border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-semibold">Published Shipments</h2>
              <p className="text-sm text-muted-foreground">
                Select any shipment to update progress and publish new notes.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by consignment number"
                className={`${adminFieldClass} pl-9`}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">Consignment</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Route</th>
                  <th className="px-2 py-2">Progress</th>
                  <th className="px-2 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.consignmentNumber} className="border-b border-border/70">
                    <td className="px-2 py-3 font-medium">{s.consignmentNumber}</td>
                    <td className="px-2 py-3">{s.status}</td>
                    <td className="px-2 py-3">
                      {s.route.originLabel} → {s.route.destinationLabel}
                    </td>
                    <td className="px-2 py-3">{s.route.journeyProgressPercent.toFixed(1)}%</td>
                    <td className="px-2 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-none"
                        onClick={() => editShipment(s)}
                      >
                        Edit / Publish
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(mode === 'create' || editingId) && (
        <form onSubmit={saveShipment} className="space-y-4 border border-border bg-card p-5">
          <AdminSection title="Core Shipment">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Consignment Number</label>
                <Input
                  value={form.consignmentNumber}
                  onChange={(e) =>
                    updateField('consignmentNumber', e.target.value.toUpperCase())
                  }
                  placeholder="ASL123456789012-CARGO"
                  className={adminFieldClass}
                />
                <button
                  type="button"
                  onClick={() => updateField('consignmentNumber', makeConsignmentNumber())}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary"
                >
                  <Sparkles className="size-3.5" />
                  Regenerate code
                </button>
              </div>
              <AdminSelect
                label="Status"
                value={form.status}
                onChange={(v) => updateField('status', v as FormState['status'])}
                options={SHIPMENT_STATUSES}
                placeholder="-- Select Type --"
              />
              <AdminSelect
                label="Delivery Mode"
                value={form.deliveryMode}
                onChange={(v) =>
                  updateField('deliveryMode', v as FormState['deliveryMode'])
                }
                options={DELIVERY_MODES}
              />
            </div>
          </AdminSection>

          <AdminSection title="Route & Schedule">
            <div className="grid gap-4 md:grid-cols-3">
              <AdminInput
                label="Origin (city, country)"
                value={form.route.originLabel}
                onChange={(v) => updateNested('route', 'originLabel', v)}
              />
              <AdminInput
                label="Destination (city, country)"
                value={form.route.destinationLabel}
                onChange={(v) => updateNested('route', 'destinationLabel', v)}
              />
              <AdminInput
                label="Carrier Ref Number"
                value={form.carrierRefNumber}
                onChange={(v) => updateField('carrierRefNumber', v)}
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <AdminInput
                label="Pickup Date"
                type="date"
                value={form.route.pickupDate}
                onChange={(v) => updateNested('route', 'pickupDate', v)}
              />
              <AdminInput
                label="Pickup Time"
                type="time"
                value={form.route.pickupTime}
                onChange={(v) => updateNested('route', 'pickupTime', v)}
              />
              <AdminInput
                label="Dispatch Time"
                type="datetime-local"
                value={form.route.dispatchAt}
                onChange={(v) => updateNested('route', 'dispatchAt', v)}
              />
              <AdminInput
                label="Expected Delivery"
                type="datetime-local"
                value={form.route.expectedDeliveryAt}
                onChange={(v) => updateNested('route', 'expectedDeliveryAt', v)}
              />
            </div>
            <div className="mt-4">
              <AdminInput
                label="Journey covered (%)"
                type="number"
                value={form.route.journeyProgressPercent}
                onChange={(v) => updateNested('route', 'journeyProgressPercent', v)}
              />
            </div>
          </AdminSection>

          <AdminSection title="Shipper Information">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                label="Shipper Name"
                value={form.shipper.name}
                onChange={(v) => updateNested('shipper', 'name', v)}
              />
              <AdminInput
                label="Shipper Phone"
                value={form.shipper.phone}
                onChange={(v) => updateNested('shipper', 'phone', v)}
              />
              <AdminInput
                label="Shipper Email"
                value={form.shipper.email}
                onChange={(v) => updateNested('shipper', 'email', v)}
              />
              <AdminInput
                label="Shipper Address"
                value={form.shipper.address}
                onChange={(v) => updateNested('shipper', 'address', v)}
              />
            </div>
          </AdminSection>

          <AdminSection title="Receiver Information">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                label="Receiver Name"
                value={form.receiver.name}
                onChange={(v) => updateNested('receiver', 'name', v)}
              />
              <AdminInput
                label="Receiver Phone"
                value={form.receiver.phone}
                onChange={(v) => updateNested('receiver', 'phone', v)}
              />
              <AdminInput
                label="Receiver Email"
                value={form.receiver.email}
                onChange={(v) => updateNested('receiver', 'email', v)}
              />
              <AdminInput
                label="Receiver Address"
                value={form.receiver.address}
                onChange={(v) => updateNested('receiver', 'address', v)}
              />
            </div>
          </AdminSection>

          <AdminSection title="Shipment Details">
            <div className="grid gap-4 md:grid-cols-3">
              <AdminSelect
                label="Shipment Type"
                value={form.typeOfShipment}
                onChange={(v) => updateField('typeOfShipment', v)}
                options={SHIPMENT_TYPES}
              />
              <AdminInput
                label="Product"
                value={form.cargo.product}
                onChange={(v) => updateNested('cargo', 'product', v)}
              />
              <AdminSelect
                label="Payment Mode"
                value={form.commercial.paymentMode}
                onChange={(v) => updateNested('commercial', 'paymentMode', v)}
                options={PAYMENT_MODES}
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AdminInput
                label="Total Freight"
                type="number"
                value={form.commercial.totalFreight}
                onChange={(v) => updateNested('commercial', 'totalFreight', v)}
              />
            </div>
          </AdminSection>

          <PackagesSection
            items={form.packageItems}
            onChange={(items) => updateField('packageItems', items)}
          />

          <AdminSection title="Publish Notes">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                label="Publish Note"
                value={form.historyRemark}
                onChange={(v) => updateField('historyRemark', v)}
              />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">Remarks</label>
              <Textarea
                value={form.remarks}
                onChange={(e) => updateField('remarks', e.target.value)}
                className={adminTextareaClass}
                placeholder="Public remarks shown on tracking page."
              />
            </div>
          </AdminSection>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-primary">{success}</p>}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" className="rounded-none" disabled={loading}>
              <Save className="size-4" />
              {loading ? 'Saving...' : editingId ? 'Update & Publish' : 'Create & Publish'}
            </Button>
            {editingId && (
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="rounded-none"
                onClick={() => {
                  setEditingId(null)
                  setForm({ ...EMPTY_STATE, consignmentNumber: makeConsignmentNumber() })
                  setError('')
                  setSuccess('')
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
