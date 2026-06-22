import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { benefits, jobOpenings } from '@/lib/data'
import { ArrowUpRight, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join AtlasSwift Logistics. Explore open roles across operations, technology, and compliance and help move the world forward.',
}

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Move the world forward with us"
        description="We are a global team of problem-solvers, builders, and operators obsessed with delivering on our promises."
      />

      {/* Culture */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <Image
                src="/images/team.jpg"
                alt="AtlasSwift Logistics team collaborating in a modern office"
                width={720}
                height={540}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our culture"
                title="Built on trust, driven by impact"
                description="At AtlasSwift, every shipment is a promise. We hire people who take ownership, communicate with transparency, and care deeply about the customers and colleagues who rely on them."
              />
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { value: '60+', label: 'Nationalities' },
                  { value: '4', label: 'Continental HQs' },
                  { value: '4.7/5', label: 'Employee rating' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border bg-card p-4 text-center"
                  >
                    <p className="font-sans text-2xl font-bold text-accent">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why AtlasSwift"
            title="Benefits that support your whole life"
            description="We invest in our people so they can do the best work of their careers."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-sans text-lg font-semibold text-card-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-pretty text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Open positions"
            title="Find your next role"
            description="Don’t see the right fit? Send us your details and we’ll reach out when something opens up."
          />
          <div className="mt-12 flex flex-col gap-3">
            {jobOpenings.map((job, i) => (
              <Reveal key={job.title} delay={i * 60}>
                <div className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sans text-lg font-semibold text-card-foreground">
                        {job.title}
                      </h3>
                      <Badge variant="secondary">{job.department}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {job.location}
                      </span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="gap-1 transition-colors group-hover:border-accent group-hover:text-accent"
                    asChild
                  >
                    <Link href="/contact">
                      Apply
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
