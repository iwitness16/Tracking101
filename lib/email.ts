import 'server-only'

import nodemailer from 'nodemailer'

type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
}

export type EmailResult = {
  sent: boolean
  error?: string
}

function getTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null

  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true' || port === 465

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  )
}

export async function sendEmail(input: SendEmailInput): Promise<EmailResult> {
  const transport = getTransport()
  if (!transport) {
    return { sent: false, error: 'SMTP is not configured' }
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER
  if (!fromAddress) {
    return { sent: false, error: 'SMTP_FROM or SMTP_USER is required' }
  }

  try {
    await transport.sendMail({
      from: `"AtlasSwift Logistics" <${fromAddress}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: fromAddress,
    })
    return { sent: true }
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
