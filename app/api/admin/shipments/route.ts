import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { notifyReceiverShipmentCreated } from '@/lib/shipment-notifications'
import { createShipment, listShipments, type ShipmentInput } from '@/lib/shipments'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const shipments = await listShipments()
  return NextResponse.json({ shipments })
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as ShipmentInput
    const shipment = await createShipment(body)
    const emailResult = await notifyReceiverShipmentCreated(shipment)
    if (!emailResult.sent) {
      console.warn(
        `[shipment-email] Create notification not sent for ${shipment.consignmentNumber}: ${emailResult.error}`,
      )
    }
    return NextResponse.json({ shipment, email: emailResult })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Create failed' },
      { status: 400 },
    )
  }
}
