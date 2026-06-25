import { BrandLogo } from '@/components/brand-logo'
import {
  mailtoHref,
  PHONE_DISPLAY,
  SITE_EMAIL,
  telHref,
  whatsappHref,
} from '@/lib/site-contact'
import { Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14c.5-1.88.5-5.8.5-5.8s0-3.92-.5-5.8zM9.6 15.57V8.43L15.82 12 9.6 15.57z" />
    </svg>
  )
}

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Newsroom', href: '/about' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Air Freight', href: '/services' },
      { label: 'Ocean Freight', href: '/services' },
      { label: 'Ground & Last Mile', href: '/services' },
      { label: 'Warehousing', href: '/services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Track a Shipment', href: '/tracking' },
      { label: 'Get a Quote', href: '/contact' },
      { label: 'Support', href: '/contact' },
    ],
  },
]

const socials = [
  { icon: LinkedInIcon, label: 'LinkedIn', href: '#' },
  { icon: XIcon, label: 'X', href: '#' },
  { icon: YouTubeIcon, label: 'YouTube', href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-border section-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <BrandLogo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Moving the world forward. AtlasSwift connects businesses to over
              180 countries with reliable air, ocean, and ground freight backed
              by real-time visibility.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-primary" />
                1 Harbor Gateway, Rotterdam, NL
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-primary" />
                <a href={telHref} className="transition-colors hover:text-primary">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="size-4 text-primary" />
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  WhatsApp {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary" />
                <a href={mailtoHref} className="transition-colors hover:text-primary">
                  {SITE_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AtlasSwift Logistics B.V. All
            rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="size-3.5 text-primary" />
            <span>English (Global)</span>
          </div>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
