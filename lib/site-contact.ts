export const SITE_EMAIL = 'info@atlasswiftlogistics.com'
export const WHATSAPP_E164 = '19036922271'
export const PHONE_DISPLAY = '+1 (903) 692-2271'

export const mailtoHref = `mailto:${SITE_EMAIL}`

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${WHATSAPP_E164}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export const telHref = `tel:+${WHATSAPP_E164}`
