import { cn } from '@/lib/utils'

/**
 * Trusted carrier / partner logos.
 *
 * These are clean text-based wordmarks so the marquee always renders crisply.
 * To use official brand logos instead, drop SVG/PNG files into
 * `public/images/partners/` (e.g. fedex.svg) and replace the <span> wordmark
 * with an <img src="/images/partners/fedex.svg" alt="FedEx" /> for each item.
 */
const partners = [
  'FedEx',
  'USPS',
  'DHL',
  'Maersk',
  'UPS',
  'DB Schenker',
  'Kuehne+Nagel',
  'CMA CGM',
]

function Logo({ name }: { name: string }) {
  return (
    <span className="font-heading text-xl font-bold tracking-tight text-muted-foreground/70 transition-colors duration-300 hover:text-foreground">
      {name}
    </span>
  )
}

export function PartnersMarquee({ className }: { className?: string }) {
  const loop = [...partners, ...partners]
  return (
    <div className={cn('marquee-pause relative overflow-hidden', className)}>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-16 pr-16">
        {loop.map((name, i) => (
          <Logo key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  )
}
