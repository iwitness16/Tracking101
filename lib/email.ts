import 'server-only'

import tls from 'tls'
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

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true' || port === 465
  return { host, port, secure, user, pass }
}

function getTransport() {
  const cfg = getSmtpConfig()
  if (!cfg) return null
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  })
}

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  )
}

/** Build a raw RFC-2822 message string without sending it */
async function buildRawMessage(options: {
  from: string
  to: string
  subject: string
  html: string
  text: string
  replyTo: string
}): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MailComposer = require('nodemailer/lib/mail-composer') as new (opts: object) => {
    compile(): { build(cb: (err: Error | null, msg: Buffer) => void): void }
  }
  return new Promise((resolve, reject) => {
    new MailComposer(options).compile().build((err, msg) => {
      if (err) reject(err)
      else resolve(msg.toString())
    })
  })
}

/**
 * Appends a raw RFC-2822 message directly to an IMAP folder via TLS socket.
 * Used to:
 *   1. Save outbound mail to the "Sent" folder.
 *   2. Deliver admin self-notifications straight to Inbox — SpaceMail and most
 *      shared hosts silently drop SMTP mail where envelope from === to.
 */
function imapAppend(
  rawMessage: string,
  folder: string,
  flags: string[] = [],
): Promise<{ ok: boolean; error?: string }> {
  const cfg = getSmtpConfig()
  if (!cfg) return Promise.resolve({ ok: false, error: 'IMAP credentials not configured' })

  const imapHost = process.env.IMAP_HOST || cfg.host
  const imapPort = Number(process.env.IMAP_PORT || 993)

  return new Promise((resolve) => {
    let settled = false
    const done = (result: { ok: boolean; error?: string }) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      try { socket.destroy() } catch { /* ignore */ }
      resolve(result)
    }

    const timer = setTimeout(
      () => done({ ok: false, error: 'IMAP append timed out after 15s' }),
      15_000,
    )

    const socket = tls.connect(
      { host: imapHost, port: imapPort, rejectUnauthorized: false },
      () => {
        const msgBytes = Buffer.from(rawMessage)
        const flagStr = flags.length ? `(${flags.join(' ')}) ` : ''
        const now = new Date().toUTCString()

        let tag = 1
        let state: 'greeting' | 'login' | 'append' | 'literal' = 'greeting'
        let buf = ''

        const send = (cmd: string) => {
          socket.write(`A${tag++} ${cmd}\r\n`)
        }

        socket.on('data', (chunk: Buffer) => {
          buf += chunk.toString()
          const lines = buf.split('\r\n')
          buf = lines.pop() ?? ''

          for (const line of lines) {
            if (!line) continue

            if (state === 'greeting' && line.startsWith('* OK')) {
              state = 'login'
              send(`LOGIN "${cfg.user}" "${cfg.pass.replace(/"/g, '\\"')}"`)
              continue
            }

            if (state === 'login' && /^A\d+ OK/.test(line)) {
              state = 'append'
              send(`APPEND "${folder}" ${flagStr}"${now}" {${msgBytes.length}}`)
              continue
            }

            if (state === 'login' && /^A\d+ (NO|BAD)/.test(line)) {
              done({ ok: false, error: `IMAP LOGIN failed: ${line}` })
              continue
            }

            if (state === 'append' && line.startsWith('+ ')) {
              state = 'literal'
              socket.write(msgBytes)
              socket.write(Buffer.from('\r\n'))
              continue
            }

            if (state === 'literal' && /^A\d+ OK/.test(line)) {
              send('LOGOUT')
              done({ ok: true })
              continue
            }

            if (/^A\d+ (NO|BAD)/.test(line)) {
              done({ ok: false, error: `IMAP error: ${line}` })
            }
          }
        })

        socket.on('error', (err: Error) => done({ ok: false, error: err.message }))
      },
    )

    socket.on('error', (err: Error) => done({ ok: false, error: err.message }))
  })
}

export async function sendEmail(input: SendEmailInput): Promise<EmailResult> {
  const cfg = getSmtpConfig()
  if (!cfg) return { sent: false, error: 'SMTP is not configured' }

  const fromAddress = process.env.SMTP_FROM || cfg.user

  const isSelfSend =
    input.to.trim().toLowerCase() === fromAddress.trim().toLowerCase()

  let raw: string
  try {
    raw = await buildRawMessage({
      from: `"AtlasSwift Logistics" <${fromAddress}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: fromAddress,
    })
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : 'Failed to compose message',
    }
  }

  try {
    if (isSelfSend) {
      // Bypass SMTP — append directly to IMAP Inbox to avoid self-send suppression
      const appendResult = await imapAppend(raw, 'INBOX', [])
      if (!appendResult.ok) {
        console.warn(
          `[email] IMAP self-deliver failed (${appendResult.error}), trying SMTP fallback`,
        )
        const transport = getTransport()!
        await transport.sendMail({
          from: `"AtlasSwift Logistics" <${fromAddress}>`,
          to: input.to,
          subject: input.subject,
          html: input.html,
          text: input.text,
          replyTo: fromAddress,
        })
      }
    } else {
      // Normal outbound SMTP delivery
      const transport = getTransport()!
      await transport.sendMail({
        from: `"AtlasSwift Logistics" <${fromAddress}>`,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        replyTo: fromAddress,
      })
    }

    // Save to Sent folder (best-effort, never blocks the response)
    imapAppend(raw, 'Sent', ['\\Seen']).catch((e: unknown) =>
      console.warn('[email] Could not save to Sent folder:', e),
    )

    return { sent: true }
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
