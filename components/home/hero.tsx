'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, PackageSearch, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const HERO_IMAGES = [
  '/images/plane2.jpg',
  '/images/plane3.jpg',
  '/images/plane4.webp',
] as const

const SLIDE_INTERVAL_MS = 6000

function HeroBackground({ parallaxOffset }: { parallaxOffset: number }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)

    HERO_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
    })

    if (mq.matches) return

    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden"
      style={{ transform: reduceMotion ? undefined : `translateY(${parallaxOffset * 0.15}px)` }}
      aria-hidden="true"
    >
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className={cn(
            'hero-slide absolute inset-0',
            i === activeIndex && 'is-active',
          )}
        >
          <img
            src={src}
            alt=""
            className="hero-slide-img"
          />
        </div>
      ))}

      {/* Translucent wash — clearer image visibility, text still readable */}
      <div className="absolute inset-0 bg-white/38 max-md:bg-white/32" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/28 via-white/42 to-background/92 max-md:from-white/20 max-md:via-white/38 max-md:to-background/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/28 to-white/15 max-md:from-white/35 max-md:via-white/20 max-md:to-white/10" />
    </div>
  )
}

export function Hero() {
  const [offset, setOffset] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduce) return
    const onScroll = () => setOffset(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <HeroBackground parallaxOffset={offset} />

      {/* Decorative red accent blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-0 -z-10 h-96 w-96 rounded-full bg-primary/8 blur-3xl animate-drift"
      />

      <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 pt-24 pb-16 sm:min-h-[92vh] sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
        <div className="max-w-3xl">
          <span
            className={`inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur ${mounted ? 'hero-enter hero-enter-1' : 'opacity-0'}`}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-live rounded-full bg-primary" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Trusted in 180+ countries
          </span>

          <h1
            className={`mt-6 text-balance font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl ${mounted ? 'hero-enter hero-enter-2' : 'opacity-0'}`}
          >
            Global freight,
            <br />
            delivered with{' '}
            <span className="text-primary">precision</span>.
          </h1>

          <p
            className={`mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground ${mounted ? 'hero-enter hero-enter-3' : 'opacity-0'}`}
          >
            AtlasSwift moves your cargo across air, ocean, and ground with
            real-time visibility, customs expertise, and a global network built
            for speed and reliability.
          </p>

          <div
            className={`mt-9 flex flex-col gap-3 sm:flex-row ${mounted ? 'hero-enter hero-enter-4' : 'opacity-0'}`}
          >
            <Button
              size="lg"
              className="h-12 px-6 text-base shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
              render={
                <Link href="/tracking">
                  <PackageSearch className="size-5" />
                  Track a Shipment
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-foreground/15 bg-white/80 px-6 text-base backdrop-blur transition-transform hover:-translate-y-0.5"
              render={
                <Link href="/contact">
                  Request a Quote
                  <ArrowRight className="size-5" />
                </Link>
              }
            />
          </div>

          <div
            className={`mt-10 flex items-center gap-2 text-sm text-muted-foreground ${mounted ? 'hero-enter hero-enter-5' : 'opacity-0'}`}
          >
            <ShieldCheck className="size-4 text-primary" />
            ISO 9001 certified &middot; 99.4% on-time delivery &middot; 24/7
            support
          </div>
        </div>
      </div>
    </section>
  )
}
