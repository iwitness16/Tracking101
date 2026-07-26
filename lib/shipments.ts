export const DELIVERY_MODES = [
  'Air freight',
  'International shipping',
  'Truck load',
  'Van mode',
] as const

export const SHIPMENT_STATUSES = [
  'Pending',
  'Picked up',
  'On Hold',
  'In Transit',
  'Enroute',
  'Out for delivery',
  'Delivered',
  'Returned',
  'Cancelled',
] as const

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number]

import { PIECE_TYPES, SHIPMENT_TYPES } from '@/lib/shipment-options'

export type ShipmentHistoryItem = {
  status: ShipmentStatus
  location: string
  timestamp: string
  remark?: string
}

export type PackageLineItem = {
  qty: number
  pieceType: (typeof PIECE_TYPES)[number]
  description: string
  lengthCm: number
  widthCm: number
  heightCm: number
  actualWeightKg: number
  volumeCubicM: number
  volumetricWeightKg: number
}

export type ShipmentMetrics = {
  totalVolumeCubicM: number
  totalActualWeightKg: number
  totalVolumetricWeightKg: number
}

export function computeLineMetrics(
  item: Pick<
    PackageLineItem,
    'qty' | 'lengthCm' | 'widthCm' | 'heightCm' | 'actualWeightKg'
  >,
): Pick<PackageLineItem, 'volumeCubicM' | 'volumetricWeightKg'> {
  const qty = Math.max(0, Number(item.qty) || 0)
  const l = Math.max(0, Number(item.lengthCm) || 0)
  const w = Math.max(0, Number(item.widthCm) || 0)
  const h = Math.max(0, Number(item.heightCm) || 0)
  const unitVolume = (l * w * h) / 1_000_000
  const unitVolWeight = (l * w * h) / 5000
  return {
    volumeCubicM: unitVolume * qty,
    volumetricWeightKg: unitVolWeight * qty,
  }
}

export function computeShipmentMetrics(
  items: PackageLineItem[],
): ShipmentMetrics {
  return items.reduce(
    (acc, item) => ({
      totalVolumeCubicM: acc.totalVolumeCubicM + item.volumeCubicM,
      totalActualWeightKg: acc.totalActualWeightKg + item.actualWeightKg * item.qty,
      totalVolumetricWeightKg:
        acc.totalVolumetricWeightKg + item.volumetricWeightKg,
    }),
    {
      totalVolumeCubicM: 0,
      totalActualWeightKg: 0,
      totalVolumetricWeightKg: 0,
    },
  )
}

export function enrichPackageLine(
  item: Omit<PackageLineItem, 'volumeCubicM' | 'volumetricWeightKg'>,
): PackageLineItem {
  const metrics = computeLineMetrics(item)
  return { ...item, ...metrics }
}

export type ShipmentRecord = {
  consignmentNumber: string
  status: ShipmentStatus
  deliveryMode: (typeof DELIVERY_MODES)[number]
  typeOfShipment: (typeof SHIPMENT_TYPES)[number] | string
  carrierRefNumber: string
  route: {
    originLabel: string
    destinationLabel: string
    originCoords: [number, number]
    destinationCoords: [number, number]
    pickupDate: string
    pickupTime: string
    dispatchAt: string
    expectedDeliveryAt: string
    journeyProgressPercent: number
  }
  shipper: {
    name: string
    phone: string
    email: string
    address: string
  }
  receiver: {
    name: string
    phone: string
    email: string
    address: string
  }
  cargo: {
    product: string
    weightKg: number
    quantity: number
  }
  packageItems: PackageLineItem[]
  metrics: ShipmentMetrics
  commercial: {
    paymentMode: string
    totalFreight: number
  }
  remarks: string
  createdAt: string
  updatedAt: string
  accumulatedTransitMs: number
  transitResumedAt: string | null
  history: ShipmentHistoryItem[]
}

export type TrackingShipment = ShipmentRecord & {
  progress: number
  estimatedDelivery: string
  origin: { city: string; coords: [number, number] }
  destination: { city: string; coords: [number, number] }
  current: { city: string; coords: [number, number] }
}

function firestoreBase() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!projectId || !apiKey) return null
  return {
    listUrl: `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/shipments?key=${apiKey}`,
    documentUrl: (id: string) =>
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/shipments/${encodeURIComponent(id)}?key=${apiKey}`,
  }
}

function isMovingStatus(status: ShipmentStatus) {
  return (
    status === 'In Transit' || status === 'Out for delivery' || status === 'Enroute'
  )
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function normalizeRecord(record: ShipmentRecord): ShipmentRecord {
  const packageItems = Array.isArray(record.packageItems)
    ? record.packageItems.map((p) =>
        enrichPackageLine({
          qty: Number(p.qty) || 0,
          pieceType: (PIECE_TYPES as readonly string[]).includes(p.pieceType)
            ? p.pieceType
            : 'Box',
          description: p.description || '',
          lengthCm: Number(p.lengthCm) || 0,
          widthCm: Number(p.widthCm) || 0,
          heightCm: Number(p.heightCm) || 0,
          actualWeightKg: Number(p.actualWeightKg) || 0,
        }),
      )
    : []

  return {
    ...record,
    route: {
      ...record.route,
      journeyProgressPercent: Number(record.route?.journeyProgressPercent || 0),
      pickupDate: record.route?.pickupDate || '',
      pickupTime: record.route?.pickupTime || '',
    },
    cargo: {
      ...record.cargo,
      weightKg: Number(record.cargo?.weightKg || 0),
      quantity: Number(record.cargo?.quantity || 0),
    },
    shipper: {
      name: record.shipper?.name || '',
      phone: record.shipper?.phone || '',
      email: record.shipper?.email || '',
      address: record.shipper?.address || '',
    },
    receiver: {
      name: record.receiver?.name || '',
      phone: record.receiver?.phone || '',
      email: record.receiver?.email || '',
      address: record.receiver?.address || '',
    },
    packageItems,
    metrics: computeShipmentMetrics(packageItems),
    commercial: {
      paymentMode: record.commercial?.paymentMode || '',
      totalFreight: Number(record.commercial?.totalFreight || 0),
    },
    accumulatedTransitMs: Number(record.accumulatedTransitMs || 0),
    history: Array.isArray(record.history) ? record.history : [],
  }
}

function deriveTracking(record: ShipmentRecord): TrackingShipment {
  const safe = normalizeRecord(record)
  const now = Date.now()
  const dispatch = new Date(safe.route.dispatchAt).getTime()
  const eta = new Date(safe.route.expectedDeliveryAt).getTime()
  const totalDurationMs = Math.max(eta - dispatch, 1)

  const runningTransitMs = safe.transitResumedAt
    ? now - new Date(safe.transitResumedAt).getTime()
    : 0

  const elapsedTransitMs = isMovingStatus(safe.status)
    ? safe.accumulatedTransitMs + Math.max(runningTransitMs, 0)
    : safe.accumulatedTransitMs

  const computedProgress =
    safe.status === 'Delivered'
      ? 100
      : Math.max(0, Math.min(100, (elapsedTransitMs / totalDurationMs) * 100))
  const progress = Math.max(computedProgress, safe.route.journeyProgressPercent)

  const originCoords = safe.route.originCoords
  const destinationCoords = safe.route.destinationCoords

  const currentCoords: [number, number] = [
    lerp(originCoords[0], destinationCoords[0], progress / 100),
    lerp(originCoords[1], destinationCoords[1], progress / 100),
  ]

  const currentCity = isMovingStatus(safe.status)
    ? `En route (${progress.toFixed(1)}%)`
    : safe.status

  return {
    ...safe,
    progress,
    estimatedDelivery: new Date(safe.route.expectedDeliveryAt).toLocaleString(),
    origin: { city: safe.route.originLabel, coords: originCoords },
    destination: { city: safe.route.destinationLabel, coords: destinationCoords },
    current: { city: currentCity, coords: currentCoords },
  }
}

function toFirestoreDoc(record: ShipmentRecord) {
  return {
    fields: {
      consignment: { stringValue: record.consignmentNumber },
      data: { stringValue: JSON.stringify(record) },
      updatedAt: { stringValue: record.updatedAt },
      createdAt: { stringValue: record.createdAt },
    },
  }
}

function fromFirestoreDoc(doc: {
  fields?: { data?: { stringValue?: string } }
}): ShipmentRecord | null {
  const raw = doc.fields?.data?.stringValue
  if (!raw) return null
  try {
    return normalizeRecord(JSON.parse(raw) as ShipmentRecord)
  } catch {
    return null
  }
}

export function makeConsignmentNumber() {
  const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('')
  return `ASL${digits}-CARGO`
}

async function geocodeLocation(label: string): Promise<[number, number]> {
  const encoded = encodeURIComponent(label)
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AtlasSwift/1.0 (ops tracking)' },
    cache: 'no-store',
  })
  if (!res.ok) return [0, 0]
  const data = (await res.json()) as Array<{ lat: string; lon: string }>
  if (!data.length) return [0, 0]
  return [Number(data[0].lat), Number(data[0].lon)]
}

export async function listShipments() {
  const base = firestoreBase()
  if (!base) return []
  const { listUrl } = base
  const res = await fetch(listUrl, { cache: 'no-store' })
  if (!res.ok) return []
  const body = (await res.json()) as { documents?: unknown[] }
  return (body.documents || [])
    .map((d) =>
      fromFirestoreDoc(d as { fields?: { data?: { stringValue?: string } } }),
    )
    .filter((d): d is ShipmentRecord => Boolean(d))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function getShipmentByConsignment(consignmentNumber: string) {
  const base = firestoreBase()
  if (!base) return null
  const { documentUrl } = base
  const res = await fetch(documentUrl(consignmentNumber), { cache: 'no-store' })
  if (!res.ok) return null
  const doc = (await res.json()) as { fields?: { data?: { stringValue?: string } } }
  const record = fromFirestoreDoc(doc)
  return record ? deriveTracking(record) : null
}

export type ShipmentInput = Omit<
  ShipmentRecord,
  | 'consignmentNumber'
  | 'createdAt'
  | 'updatedAt'
  | 'accumulatedTransitMs'
  | 'transitResumedAt'
  | 'history'
> & { consignmentNumber?: string; historyRemark?: string }

function ensure(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function isValidConsignment(code: string) {
  return /^ASL\d{12}-CARGO$/.test(code)
}

function validateShipmentInput(input: ShipmentInput, partial = false) {
  if (!partial || input.consignmentNumber) {
    if (input.consignmentNumber) {
      ensure(
        isValidConsignment(input.consignmentNumber),
        'Consignment number must follow ASL###########-CARGO format.',
      )
    }
  }
  if (!partial || input.route) {
    ensure(Boolean(input.route), 'Route details are required.')
    if (input.route) {
      ensure(Boolean(input.route.originLabel?.trim()), 'Origin is required.')
      ensure(Boolean(input.route.destinationLabel?.trim()), 'Destination is required.')
      ensure(Boolean(input.route.dispatchAt), 'Dispatch time is required.')
      ensure(Boolean(input.route.expectedDeliveryAt), 'Expected delivery time is required.')
      ensure(
        Number(input.route.journeyProgressPercent) >= 0 &&
          Number(input.route.journeyProgressPercent) <= 100,
        'Journey progress must be between 0 and 100.',
      )
    }
  }
  if (!partial || input.shipper) {
    ensure(Boolean(input.shipper?.name?.trim()), 'Shipper name is required.')
    ensure(Boolean(input.shipper?.phone?.trim()), 'Shipper phone is required.')
  }
  if (!partial || input.receiver) {
    ensure(Boolean(input.receiver?.name?.trim()), 'Receiver name is required.')
    ensure(Boolean(input.receiver?.phone?.trim()), 'Receiver phone is required.')
    if (!partial) {
      ensure(Boolean(input.receiver?.email?.trim()), 'Receiver email is required.')
    }
  }
  if (!partial || input.route) {
    if (input.route && !partial) {
      ensure(Boolean(input.route.pickupDate), 'Pickup date is required.')
      ensure(Boolean(input.route.pickupTime), 'Pickup time is required.')
    }
  }
  if (!partial || input.cargo) {
    ensure(Boolean(input.cargo?.product?.trim()), 'Product is required.')
  }
  if (!partial || input.packageItems) {
    if (!partial) {
      ensure(
        Array.isArray(input.packageItems) && input.packageItems.length > 0,
        'Add at least one package line.',
      )
    }
  }
  if (!partial || input.commercial) {
    ensure(
      Number(input.commercial?.totalFreight) >= 0,
      'Total freight must be a non-negative number.',
    )
  }
}

export async function createShipment(input: ShipmentInput) {
  validateShipmentInput(input)
  const base = firestoreBase()
  if (!base) {
    throw new Error(
      'Missing Firebase env vars: NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_API_KEY',
    )
  }
  const nowIso = new Date().toISOString()
  const consignment = input.consignmentNumber || makeConsignmentNumber()
  const originCoords = await geocodeLocation(input.route.originLabel)
  const destinationCoords = await geocodeLocation(input.route.destinationLabel)
  const baselineProgress = Math.max(
    0,
    Math.min(100, Number(input.route.journeyProgressPercent || 0)),
  )
  const dispatch = new Date(input.route.dispatchAt).getTime()
  const eta = new Date(input.route.expectedDeliveryAt).getTime()
  const totalDurationMs = Math.max(eta - dispatch, 1)
  const accumulatedTransitMs = Math.floor((baselineProgress / 100) * totalDurationMs)

  const packageItems = (input.packageItems || []).map((p) => enrichPackageLine(p))
  const metrics = computeShipmentMetrics(packageItems)
  const totalQty = packageItems.reduce((s, p) => s + p.qty, 0)

  const record: ShipmentRecord = {
    ...input,
    consignmentNumber: consignment,
    route: {
      ...input.route,
      originCoords,
      destinationCoords,
      journeyProgressPercent: baselineProgress,
    },
    packageItems,
    metrics,
    cargo: {
      ...input.cargo,
      weightKg: metrics.totalActualWeightKg || input.cargo.weightKg,
      quantity: totalQty || input.cargo.quantity,
    },
    createdAt: nowIso,
    updatedAt: nowIso,
    accumulatedTransitMs,
    transitResumedAt: isMovingStatus(input.status) ? nowIso : null,
    history: [
      {
        status: input.status,
        location: input.route.originLabel,
        timestamp: nowIso,
        remark: input.historyRemark || 'Shipment created',
      },
    ],
  }

  const { documentUrl } = base
  const res = await fetch(documentUrl(consignment), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toFirestoreDoc(record)),
  })
  if (!res.ok) {
    throw new Error('Failed to create shipment in Firestore.')
  }
  return deriveTracking(record)
}

export async function updateShipment(
  consignmentNumber: string,
  updates: Partial<ShipmentInput>,
) {
  validateShipmentInput(updates as ShipmentInput, true)
  const base = firestoreBase()
  if (!base) {
    throw new Error(
      'Missing Firebase env vars: NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_API_KEY',
    )
  }
  const { documentUrl } = base
  const existingRes = await fetch(documentUrl(consignmentNumber), { cache: 'no-store' })
  if (!existingRes.ok) {
    throw new Error('Shipment not found.')
  }
  const existingDoc = (await existingRes.json()) as {
    fields?: { data?: { stringValue?: string } }
  }
  const existing = fromFirestoreDoc(existingDoc)
  if (!existing) throw new Error('Shipment data is invalid.')

  const nowIso = new Date().toISOString()
  const nextStatus = (updates.status || existing.status) as ShipmentStatus
  const nextProgress = Number(
    updates.route?.journeyProgressPercent ?? existing.route.journeyProgressPercent,
  )
  let accumulatedTransitMs = existing.accumulatedTransitMs
  let transitResumedAt = existing.transitResumedAt
  const route = {
    ...existing.route,
    ...updates.route,
    journeyProgressPercent: Math.max(0, Math.min(100, nextProgress)),
  }

  const wasMoving = isMovingStatus(existing.status)
  const nowMoving = isMovingStatus(nextStatus)

  if (wasMoving && transitResumedAt) {
    accumulatedTransitMs +=
      Date.now() - new Date(transitResumedAt).getTime()
    transitResumedAt = null
  }
  if (!wasMoving && nowMoving) {
    transitResumedAt = nowIso
  }

  const dispatch = new Date(route.dispatchAt).getTime()
  const eta = new Date(route.expectedDeliveryAt).getTime()
  const totalDurationMs = Math.max(eta - dispatch, 1)
  const baselineTransitMs = Math.floor((route.journeyProgressPercent / 100) * totalDurationMs)
  accumulatedTransitMs = Math.max(accumulatedTransitMs, baselineTransitMs)

  if (updates.route?.originLabel && updates.route.originLabel !== existing.route.originLabel) {
    route.originCoords = await geocodeLocation(updates.route.originLabel)
  }
  if (
    updates.route?.destinationLabel &&
    updates.route.destinationLabel !== existing.route.destinationLabel
  ) {
    route.destinationCoords = await geocodeLocation(updates.route.destinationLabel)
  }

  const packageItems = updates.packageItems
    ? updates.packageItems.map((p) => enrichPackageLine(p))
    : existing.packageItems
  const metrics = computeShipmentMetrics(packageItems)
  const totalQty = packageItems.reduce((s, p) => s + p.qty, 0)

  const updated: ShipmentRecord = {
    ...existing,
    ...updates,
    route,
    packageItems,
    metrics,
    cargo: updates.cargo
      ? {
          ...existing.cargo,
          ...updates.cargo,
          weightKg: metrics.totalActualWeightKg || updates.cargo.weightKg,
          quantity: totalQty || updates.cargo.quantity,
        }
      : {
          ...existing.cargo,
          weightKg: metrics.totalActualWeightKg || existing.cargo.weightKg,
          quantity: totalQty || existing.cargo.quantity,
        },
    consignmentNumber,
    status: nextStatus,
    accumulatedTransitMs,
    transitResumedAt,
    updatedAt: nowIso,
    history: [
      ...existing.history,
      {
        status: nextStatus,
        location: route.originLabel,
        timestamp: nowIso,
        remark: updates.historyRemark || 'Shipment updated',
      },
    ],
  }

  const saveRes = await fetch(documentUrl(consignmentNumber), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toFirestoreDoc(updated)),
  })
  if (!saveRes.ok) throw new Error('Failed to update shipment in Firestore.')

  return deriveTracking(updated)
}

export async function deleteShipment(consignmentNumber: string) {
  const base = firestoreBase()
  if (!base) {
    throw new Error(
      'Missing Firebase env vars: NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_API_KEY',
    )
  }
  const { documentUrl } = base
  const res = await fetch(documentUrl(consignmentNumber), { method: 'DELETE' })
  if (!res.ok && res.status !== 404) {
    throw new Error('Failed to delete shipment from Firestore.')
  }
}
