import { NextResponse } from 'next/server'
import { getShipmentByConsignment } from '@/lib/shipments'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ consignment: string }> },
) {
  const { consignment } = await params
  const shipment = await getShipmentByConsignment(consignment.toUpperCase())
  if (!shipment) {
    return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
  }
  return NextResponse.json({ shipment })
}
