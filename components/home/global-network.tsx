import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

const points = [
  'Strategic hubs across 6 continents',
  'Bonded warehouses near major ports & airports',
  'Multi-modal connections for seamless transitions',
  'Local expertise with global standards',
]

export function GlobalNetwork() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1" direction="left">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <span className="h-px w-6 bg-primary" />
            Global reach
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            One network, connecting every market you serve
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            From Rotterdam to Singapore, Los Angeles to Lagos, AtlasSwift keeps
            your cargo moving through a single, unified network — so your supply
            chain stays predictable no matter where business takes you.
          </p>
          <ul className="mt-8 space-y-3.5">
            {points.map((point, i) => (
              <Reveal key={point} delay={i * 60} direction="left">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary transition-transform duration-300 hover:scale-110">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-sm text-foreground/90">{point}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Button
            size="lg"
            className="mt-9 h-11 px-5 shadow-sm shadow-primary/20 transition-transform hover:-translate-y-0.5"
            render={
              <Link href="/about">
                Explore our network
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Reveal>

        <Reveal className="order-1 lg:order-2" direction="right">
          <div className="glow-ring card-lift relative overflow-hidden rounded-3xl border border-border bg-card">
            <img
              src="/images/world-network.png"
              alt="AtlasSwift global logistics network connecting continents"
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
