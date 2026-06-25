import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { notifyReceiverShipmentUpdated } from '@/lib/shipment-notifications'
import {
  getShipmentByConsignment,
  updateShipment,
  type ShipmentInput,
} from '@/lib/shipments'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ consignment: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { consignment } = await params
  try {
    const body = (await request.json()) as Partial<ShipmentInput>
    const before = await getShipmentByConsignment(consignment)
    const shipment = await updateShipment(consignment, body)
    const emailResult =
      before && shipment
        ? await notifyReceiverShipmentUpdated(before, shipment)
        : { sent: false, error: 'Could not load previous shipment for comparison' }
    if (!emailResult.sent) {
      console.warn(
        `[shipment-email] Update notification not sent for ${consignment}: ${emailResult.error}`,
      )
    }
    return NextResponse.json({ shipment, email: emailResult })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 400 },
    )
  }
}
