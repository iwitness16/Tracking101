import { CTA } from '@/components/home/cta'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { services } from '@/lib/data'
import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Air freight, ocean freight, ground and last-mile delivery, plus smart warehousing and fulfillment from AtlasSwift Logistics.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Every mode. Every mile. One partner."
        description="Whatever you ship and wherever it needs to go, AtlasSwift designs the right blend of speed, cost, and reliability for your supply chain."
      />

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-24">
          {services.map((service, i) => (
            <Reveal key={service.slug}>
              <div
                id={service.slug}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div
                  className={i % 2 === 1 ? 'lg:order-2' : ''}
                >
                  <div className="glow-ring overflow-hidden rounded-3xl border border-border">
                    <img
                      src={service.image || '/placeholder.svg'}
                      alt={service.title}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </div>

                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    0{i + 1}
                  </span>
                  <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
                    {service.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Check className="size-3.5" />
                        </span>
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-8 h-11 px-5"
                    render={
                      <Link href="/contact">
                        Request this service
                        <ArrowRight className="size-4" />
                      </Link>
                    }
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <CTA />
    </>
  )
}
