import 'server-only'

import { sendEmail } from '@/lib/email'
import { PHONE_DISPLAY, SITE_EMAIL, whatsappHref } from '@/lib/site-contact'
import type { ShipmentRecord } from '@/lib/shipments'

function siteBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://atlasswiftlogistics.com'
  )
}

function trackingUrl(consignmentNumber: string) {
  return `${siteBaseUrl()}/tracking?cn=${encodeURIComponent(consignmentNumber)}`
}

function formatDateTime(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatPickup(route: ShipmentRecord['route']) {
  const parts = [route.pickupDate, route.pickupTime].filter(Boolean)
  return parts.length ? parts.join(' at ') : '—'
}

function emailShell({
  title,
  preview,
  bodyHtml,
}: {
  title: string
  preview: string
  bodyHtml: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <span style="display:none;max-height:0;overflow:hidden;">${preview}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e4e4e7;">
          <tr>
            <td style="background:#dc2626;padding:24px 28px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">AtlasSwift Logistics</p>
              <p style="margin:6px 0 0;font-size:13px;color:#fecaca;">Global freight, delivered with precision</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px;background:#fafafa;border-top:1px solid #e4e4e7;">
              <p style="margin:0 0 8px;font-size:12px;color:#71717a;">Questions? Contact our operations team:</p>
              <p style="margin:0;font-size:12px;color:#18181b;">
                Email: <a href="mailto:${SITE_EMAIL}" style="color:#dc2626;">${SITE_EMAIL}</a><br />
                WhatsApp / Phone: <a href="${whatsappHref()}" style="color:#dc2626;">${PHONE_DISPLAY}</a>
              </p>
              <p style="margin:14px 0 0;font-size:11px;color:#a1a1aa;">© ${new Date().getFullYear()} AtlasSwift Logistics. This is an automated shipment notification.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function detailsTable(rows: Array<[string, string]>) {
  const tr = rows
    .map(
      ([label, value]) => `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f4f4f5;font-size:13px;color:#71717a;width:38%;vertical-align:top;">${label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f4f4f5;font-size:13px;color:#18181b;font-weight:600;vertical-align:top;">${value}</td>
      </tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e4e4e7;border-radius:4px;overflow:hidden;margin:20px 0;">${tr}</table>`
}

function shipmentSummaryRows(shipment: ShipmentRecord): Array<[string, string]> {
  const qty =
    shipment.cargo.quantity ||
    shipment.packageItems.reduce((sum, item) => sum + item.qty, 0)
  const weight =
    shipment.metrics?.totalActualWeightKg ?? shipment.cargo.weightKg

  return [
    ['Consignment number', shipment.consignmentNumber],
    ['Current status', shipment.status],
    ['Delivery mode', shipment.deliveryMode],
    ['Shipment type', shipment.typeOfShipment || '—'],
    ['Origin', shipment.route.originLabel],
    ['Destination', shipment.route.destinationLabel],
    ['Pickup schedule', formatPickup(shipment.route)],
    ['Dispatch', formatDateTime(shipment.route.dispatchAt)],
    ['Expected delivery', formatDateTime(shipment.route.expectedDeliveryAt)],
    ['Product', shipment.cargo.product || '—'],
    ['Packages', `${qty} package(s)`],
    ['Total weight', `${Number(weight).toFixed(2)} kg`],
    ['Carrier reference', shipment.carrierRefNumber || '—'],
  ]
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return `${value.length} item(s)`
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function pushChange(
  changes: string[],
  label: string,
  before: unknown,
  after: unknown,
) {
  const left = formatValue(before)
  const right = formatValue(after)
  if (left !== right) changes.push(`${label}: ${left} → ${right}`)
}

export function getShipmentChanges(
  before: ShipmentRecord,
  after: ShipmentRecord,
): string[] {
  const changes: string[] = []

  pushChange(changes, 'Status', before.status, after.status)
  pushChange(changes, 'Delivery mode', before.deliveryMode, after.deliveryMode)
  pushChange(changes, 'Shipment type', before.typeOfShipment, after.typeOfShipment)
  pushChange(changes, 'Carrier reference', before.carrierRefNumber, after.carrierRefNumber)
  pushChange(changes, 'Origin', before.route.originLabel, after.route.originLabel)
  pushChange(
    changes,
    'Destination',
    before.route.destinationLabel,
    after.route.destinationLabel,
  )
  pushChange(changes, 'Pickup date', before.route.pickupDate, after.route.pickupDate)
  pushChange(changes, 'Pickup time', before.route.pickupTime, after.route.pickupTime)
  pushChange(
    changes,
    'Dispatch time',
    formatDateTime(before.route.dispatchAt),
    formatDateTime(after.route.dispatchAt),
  )
  pushChange(
    changes,
    'Expected delivery',
    formatDateTime(before.route.expectedDeliveryAt),
    formatDateTime(after.route.expectedDeliveryAt),
  )
  pushChange(
    changes,
    'Journey progress',
    `${before.route.journeyProgressPercent}%`,
    `${after.route.journeyProgressPercent}%`,
  )
  pushChange(changes, 'Product', before.cargo.product, after.cargo.product)
  pushChange(changes, 'Total weight (kg)', before.cargo.weightKg, after.cargo.weightKg)
  pushChange(changes, 'Package count', before.cargo.quantity, after.cargo.quantity)
  pushChange(changes, 'Payment mode', before.commercial.paymentMode, after.commercial.paymentMode)
  pushChange(
    changes,
    'Total freight',
    before.commercial.totalFreight,
    after.commercial.totalFreight,
  )
  pushChange(changes, 'Remarks', before.remarks, after.remarks)
  pushChange(changes, 'Receiver name', before.receiver.name, after.receiver.name)
  pushChange(changes, 'Receiver phone', before.receiver.phone, after.receiver.phone)
  pushChange(changes, 'Receiver email', before.receiver.email, after.receiver.email)
  pushChange(changes, 'Receiver address', before.receiver.address, after.receiver.address)

  const beforePackages = before.packageItems.length
  const afterPackages = after.packageItems.length
  if (beforePackages !== afterPackages) {
    changes.push(`Package lines: ${beforePackages} → ${afterPackages}`)
  }

  const beforeVol = before.metrics?.totalVolumeCubicM ?? 0
  const afterVol = after.metrics?.totalVolumeCubicM ?? 0
  if (Math.abs(beforeVol - afterVol) > 0.0001) {
    changes.push(
      `Total volume (cu. m.): ${beforeVol.toFixed(2)} → ${afterVol.toFixed(2)}`,
    )
  }

  return changes
}

export async function notifyReceiverShipmentCreated(shipment: ShipmentRecord) {
  const to = shipment.receiver.email?.trim()
  if (!to) {
    return { sent: false, error: 'Receiver email is missing' }
  }

  const trackUrl = trackingUrl(shipment.consignmentNumber)
  const rows = shipmentSummaryRows(shipment)
  const bodyHtml = `
    <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Dear ${shipment.receiver.name || 'Customer'},</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#3f3f46;">
      Your shipment has been registered with AtlasSwift Logistics. Below are your shipment details and current status.
      You can track progress at any time using your consignment number.
    </p>
    ${detailsTable(rows)}
    <p style="margin:24px 0 0;text-align:center;">
      <a href="${trackUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 24px;">
        Track your shipment
      </a>
    </p>
    <p style="margin:20px 0 0;font-size:12px;color:#71717a;text-align:center;">
      Or visit <a href="${trackUrl}" style="color:#dc2626;">${trackUrl}</a>
    </p>
  `

  const text = [
    `Dear ${shipment.receiver.name || 'Customer'},`,
    '',
    'Your shipment has been registered with AtlasSwift Logistics.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Track your shipment: ${trackUrl}`,
    '',
    `Contact: ${SITE_EMAIL} | ${PHONE_DISPLAY}`,
  ].join('\n')

  return sendEmail({
    to,
    subject: `Shipment created — ${shipment.consignmentNumber} (${shipment.status})`,
    html: emailShell({
      title: 'Shipment created',
      preview: `Your shipment ${shipment.consignmentNumber} is now ${shipment.status}.`,
      bodyHtml,
    }),
    text,
  })
}

export async function notifyReceiverShipmentUpdated(
  before: ShipmentRecord,
  after: ShipmentRecord,
) {
  const to = after.receiver.email?.trim()
  if (!to) {
    return { sent: false, error: 'Receiver email is missing' }
  }

  const changes = getShipmentChanges(before, after)
  if (changes.length === 0) {
    return { sent: false, error: 'No trackable changes detected' }
  }

  const trackUrl = trackingUrl(after.consignmentNumber)
  const changeListHtml = changes
    .map(
      (line) =>
        `<li style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#3f3f46;">${line}</li>`,
    )
    .join('')

  const bodyHtml = `
    <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Dear ${after.receiver.name || 'Customer'},</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#3f3f46;">
      Your shipment <strong>${after.consignmentNumber}</strong> has been updated by our operations team.
      Current status: <strong>${after.status}</strong>.
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#18181b;">What changed</p>
    <ul style="margin:0 0 20px;padding-left:20px;">${changeListHtml}</ul>
    ${detailsTable([
      ['Consignment number', after.consignmentNumber],
      ['Current status', after.status],
      ['Origin → Destination', `${after.route.originLabel} → ${after.route.destinationLabel}`],
      ['Expected delivery', formatDateTime(after.route.expectedDeliveryAt)],
    ])}
    <p style="margin:24px 0 0;text-align:center;">
      <a href="${trackUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 24px;">
        View live tracking
      </a>
    </p>
  `

  const text = [
    `Dear ${after.receiver.name || 'Customer'},`,
    '',
    `Your shipment ${after.consignmentNumber} has been updated.`,
    `Current status: ${after.status}`,
    '',
    'What changed:',
    ...changes.map((c) => `- ${c}`),
    '',
    `Track your shipment: ${trackUrl}`,
    '',
    `Contact: ${SITE_EMAIL} | ${PHONE_DISPLAY}`,
  ].join('\n')

  return sendEmail({
    to,
    subject: `Shipment update — ${after.consignmentNumber} (${after.status})`,
    html: emailShell({
      title: 'Shipment update',
      preview: `Update for ${after.consignmentNumber}: now ${after.status}.`,
      bodyHtml,
    }),
    text,
  })
}

// ---------------------------------------------------------------------------
// Admin notifications — sent to ADMIN_EMAIL on every create / update
// ---------------------------------------------------------------------------

function adminEmailShell({
  title,
  preview,
  bodyHtml,
}: {
  title: string
  preview: string
  bodyHtml: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <span style="display:none;max-height:0;overflow:hidden;">${preview}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e4e4e7;">
          <tr>
            <td style="background:#1e293b;padding:20px 28px;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;">AtlasSwift Logistics — Admin Alert</p>
              <p style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;">${title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                This is an internal operations alert from AtlasSwift Logistics.
                Do not forward this email — it contains shipment details.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function adminFullDetailsTable(shipment: ShipmentRecord) {
  const rows: Array<[string, string]> = [
    ['Consignment #', shipment.consignmentNumber],
    ['Status', shipment.status],
    ['Delivery mode', shipment.deliveryMode],
    ['Shipment type', shipment.typeOfShipment || '—'],
    ['Carrier ref', shipment.carrierRefNumber || '—'],
    ['Origin', shipment.route.originLabel],
    ['Destination', shipment.route.destinationLabel],
    ['Pickup', formatPickup(shipment.route)],
    ['Dispatch', formatDateTime(shipment.route.dispatchAt)],
    ['Expected delivery', formatDateTime(shipment.route.expectedDeliveryAt)],
    ['Journey progress', `${shipment.route.journeyProgressPercent}%`],
    ['', ''],
    ['Shipper name', shipment.shipper.name || '—'],
    ['Shipper phone', shipment.shipper.phone || '—'],
    ['Shipper email', shipment.shipper.email || '—'],
    ['Shipper address', shipment.shipper.address || '—'],
    ['', ''],
    ['Receiver name', shipment.receiver.name || '—'],
    ['Receiver phone', shipment.receiver.phone || '—'],
    ['Receiver email', shipment.receiver.email || '—'],
    ['Receiver address', shipment.receiver.address || '—'],
    ['', ''],
    ['Product', shipment.cargo.product || '—'],
    ['Total weight (kg)', `${Number(shipment.cargo.weightKg).toFixed(2)} kg`],
    ['Package count', String(shipment.cargo.quantity)],
    ['Payment mode', shipment.commercial.paymentMode || '—'],
    ['Total freight', `$${Number(shipment.commercial.totalFreight).toFixed(2)}`],
    ['Remarks', shipment.remarks || '—'],
    ['Created at', formatDateTime(shipment.createdAt)],
    ['Updated at', formatDateTime(shipment.updatedAt)],
  ]

  const tr = rows
    .map(([label, value]) => {
      if (label === '') {
        return `<tr><td colspan="2" style="padding:4px 0;"></td></tr>`
      }
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;width:38%;vertical-align:top;">${label}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#0f172a;font-weight:600;vertical-align:top;">${value}</td>
      </tr>`
    })
    .join('')

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;margin:16px 0;">${tr}</table>`
}

export async function notifyAdminShipmentCreated(shipment: ShipmentRecord) {
  const to = process.env.ADMIN_EMAIL?.trim()
  if (!to) {
    return { sent: false, error: 'ADMIN_EMAIL is not configured' }
  }

  const trackUrl = trackingUrl(shipment.consignmentNumber)
  const bodyHtml = `
    <p style="margin:0 0 6px;font-size:14px;color:#64748b;">A new shipment has been created and published.</p>
    <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f172a;">${shipment.consignmentNumber}</p>

    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:6px 14px;background:#dcfce7;border-radius:4px;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#16a34a;">NEW SHIPMENT</p>
        </td>
        <td style="padding:6px 14px;background:#f1f5f9;border-radius:4px;margin-left:8px;">
          <p style="margin:0;font-size:13px;color:#475569;">${shipment.status}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0f172a;">Full shipment details</p>
    ${adminFullDetailsTable(shipment)}

    <p style="margin:20px 0 0;text-align:left;">
      <a href="${trackUrl}" style="display:inline-block;background:#1e293b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 20px;">
        View tracking page →
      </a>
    </p>
  `

  const text = [
    'NEW SHIPMENT CREATED — Admin notification',
    '',
    `Consignment: ${shipment.consignmentNumber}`,
    `Status: ${shipment.status}`,
    `Route: ${shipment.route.originLabel} → ${shipment.route.destinationLabel}`,
    `Receiver: ${shipment.receiver.name} <${shipment.receiver.email}>`,
    `Shipper: ${shipment.shipper.name}`,
    `Product: ${shipment.cargo.product}`,
    `Total freight: $${Number(shipment.commercial.totalFreight).toFixed(2)}`,
    `Expected delivery: ${formatDateTime(shipment.route.expectedDeliveryAt)}`,
    '',
    `Tracking URL: ${trackUrl}`,
  ].join('\n')

  return sendEmail({
    to,
    subject: `[Admin] New shipment — ${shipment.consignmentNumber} (${shipment.status})`,
    html: adminEmailShell({
      title: 'New shipment created',
      preview: `New: ${shipment.consignmentNumber} | ${shipment.route.originLabel} → ${shipment.route.destinationLabel}`,
      bodyHtml,
    }),
    text,
  })
}

export async function notifyAdminShipmentUpdated(
  before: ShipmentRecord,
  after: ShipmentRecord,
) {
  const to = process.env.ADMIN_EMAIL?.trim()
  if (!to) {
    return { sent: false, error: 'ADMIN_EMAIL is not configured' }
  }

  const changes = getShipmentChanges(before, after)
  if (changes.length === 0) {
    return { sent: false, error: 'No trackable changes detected' }
  }

  const trackUrl = trackingUrl(after.consignmentNumber)
  const changeListHtml = changes
    .map(
      (line) =>
        `<li style="margin:0 0 6px;font-size:13px;line-height:1.5;color:#334155;">${line}</li>`,
    )
    .join('')

  const statusChanged = before.status !== after.status

  const bodyHtml = `
    <p style="margin:0 0 6px;font-size:14px;color:#64748b;">A shipment has been updated by the operations team.</p>
    <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f172a;">${after.consignmentNumber}</p>

    ${
      statusChanged
        ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
        <tr>
          <td style="padding:6px 14px;background:#fef3c7;border-radius:4px;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#92400e;">STATUS CHANGED</p>
          </td>
          <td style="padding:0 10px;font-size:14px;color:#64748b;">→</td>
          <td style="padding:6px 14px;background:#dcfce7;border-radius:4px;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#16a34a;">${after.status}</p>
          </td>
        </tr>
      </table>`
        : ''
    }

    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f172a;">What changed (${changes.length} field${changes.length === 1 ? '' : 's'})</p>
    <ul style="margin:0 0 20px;padding-left:18px;">${changeListHtml}</ul>

    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0f172a;">Current shipment details</p>
    ${adminFullDetailsTable(after)}

    <p style="margin:20px 0 0;">
      <a href="${trackUrl}" style="display:inline-block;background:#1e293b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 20px;">
        View tracking page →
      </a>
    </p>
  `

  const text = [
    'SHIPMENT UPDATED — Admin notification',
    '',
    `Consignment: ${after.consignmentNumber}`,
    `Status: ${before.status} → ${after.status}`,
    '',
    `Changes (${changes.length}):`,
    ...changes.map((c) => `  - ${c}`),
    '',
    `Receiver: ${after.receiver.name} <${after.receiver.email}>`,
    `Route: ${after.route.originLabel} → ${after.route.destinationLabel}`,
    `Expected delivery: ${formatDateTime(after.route.expectedDeliveryAt)}`,
    '',
    `Tracking URL: ${trackUrl}`,
  ].join('\n')

  return sendEmail({
    to,
    subject: `[Admin] Shipment updated — ${after.consignmentNumber} (${after.status})`,
    html: adminEmailShell({
      title: 'Shipment updated',
      preview: `Updated: ${after.consignmentNumber} | ${changes.length} change${changes.length === 1 ? '' : 's'} | Status: ${after.status}`,
      bodyHtml,
    }),
    text,
  })
}
