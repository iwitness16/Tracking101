import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import {
  notifyAdminShipmentUpdated,
  notifyReceiverShipmentUpdated,
} from '@/lib/shipment-notifications'
import {
  deleteShipment,
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

    const [receiverEmail, adminEmail] =
      before && shipment
        ? await Promise.all([
            notifyReceiverShipmentUpdated(before, shipment),
            notifyAdminShipmentUpdated(before, shipment),
          ])
        : [
            { sent: false, error: 'Could not load previous shipment for comparison' },
            { sent: false, error: 'Could not load previous shipment for comparison' },
          ]

    if (!receiverEmail.sent) {
      console.warn(
        `[shipment-email] Receiver update notification not sent for ${consignment}: ${receiverEmail.error}`,
      )
    }
    if (!adminEmail.sent) {
      console.warn(
        `[shipment-email] Admin update notification not sent for ${consignment}: ${adminEmail.error}`,
      )
    }

    return NextResponse.json({ shipment, email: receiverEmail, adminEmail })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 400 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ consignment: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { consignment } = await params
  try {
    await deleteShipment(consignment)
    return NextResponse.json({ deleted: true, consignment })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 400 },
    )
  }
}
