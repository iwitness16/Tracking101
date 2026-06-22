'use client'

import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Menu, PackageSearch, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border bg-background/90 shadow-sm shadow-black/[0.04] backdrop-blur-xl'
          : 'border-b border-transparent bg-background/60 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="AtlasSwift Logistics home"
          className="transition-transform duration-300 hover:scale-[1.02]"
        >
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'nav-link rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                  active
                    ? 'is-active text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            size="lg"
            variant="ghost"
            className="transition-transform hover:-translate-y-px"
            render={
              <Link href="/tracking">
                <PackageSearch className="size-4" />
                Track Shipment
              </Link>
            }
          />
          <Button
            size="lg"
            className="shadow-sm shadow-primary/20 transition-transform hover:-translate-y-px"
            render={
              <Link href="/contact">
                Get a Quote
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-border bg-background/98 backdrop-blur-xl transition-[max-height,opacity] duration-400 ease-out lg:hidden',
          open ? 'max-h-96 opacity-100' : 'max-h-0 border-t-transparent opacity-0',
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/8 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="mt-2 flex flex-col gap-2">
            <Button
              size="lg"
              variant="outline"
              render={
                <Link href="/tracking">
                  <PackageSearch className="size-4" />
                  Track Shipment
                </Link>
              }
            />
            <Button
              size="lg"
              render={
                <Link href="/contact">
                  Get a Quote
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
          </div>
        </nav>
      </div>
    </header>
  )
}
