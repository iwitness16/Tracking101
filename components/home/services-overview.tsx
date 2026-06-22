import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { services } from '@/lib/data'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export function ServicesOverview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal direction="up">
        <SectionHeading
          eyebrow="What we move"
          title="End-to-end logistics, one trusted partner"
          description="From the factory floor to the final doorstep, AtlasSwift handles every mode and every mile with the same precision."
        />
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <Reveal key={service.slug} delay={i * 90} direction="scale">
            <Link
              href="/services"
              className="group card-lift relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.image || '/placeholder.svg'}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold transition-colors group-hover:text-primary">
                    {service.title}
                  </h3>
                  <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.short}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
