import { CTA } from '@/components/home/cta'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { PartnersMarquee } from '@/components/partners-marquee'
import type { Metadata } from 'next'
import { Compass, Eye, Handshake, Heart, Leaf, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'AtlasSwift Logistics is a global freight and supply chain partner moving cargo across 180+ countries with precision, transparency, and care.',
}

const values = [
  {
    icon: ShieldCheck,
    title: 'Reliability',
    desc: 'We keep our promises. On-time performance and transparency are the foundation of every relationship.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    desc: 'Real-time visibility and honest communication, so you always know exactly where your cargo stands.',
  },
  {
    icon: Handshake,
    title: 'Partnership',
    desc: 'We act as an extension of your team, invested in your growth across every market you serve.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    desc: 'Carbon-tracked shipments and greener lanes help you move goods responsibly.',
  },
]

const timeline = [
  { year: '2009', text: 'Founded in Rotterdam with a single ocean freight lane.' },
  { year: '2014', text: 'Expanded into air freight and opened our first Asia hub.' },
  { year: '2018', text: 'Launched real-time tracking platform across all modes.' },
  { year: '2021', text: 'Reached 100+ countries and 25 global fulfillment centers.' },
  { year: '2024', text: 'Now serving 180+ countries with 38 hubs and 4.2M annual shipments.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About AtlasSwift"
        title="We move the world forward"
        description="Since 2009, AtlasSwift has grown from a single trade lane into a global logistics network trusted by thousands of businesses to deliver on their promises."
      />

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="glow-ring overflow-hidden rounded-3xl border border-border">
              <img
                src="/images/about-operations.png"
                alt="AtlasSwift global operations control room"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <Compass className="size-4" />
              Our mission
            </span>
            <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Logistics that businesses can build on
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our mission is simple: to make global trade effortless. We combine
              a resilient worldwide network with technology that gives our
              customers complete visibility and control over their supply
              chains.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              From the smallest parcel to the largest project cargo, we treat
              every shipment as a promise — and we are relentless about keeping
              it.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="size-4 text-primary" />
              Proudly serving 12,000+ customers worldwide
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border section-muted">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Our values"
            title="The principles behind every shipment"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={(i % 4) * 80}>
                <div className="h-full rounded-2xl border border-border bg-background p-7">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <value.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Our journey"
          title="Fifteen years of growth"
        />
        <div className="mt-14 space-y-0">
          {timeline.map((item, i) => (
            <Reveal key={item.year} delay={i * 70}>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex size-3 shrink-0 items-center justify-center">
                    <span className="size-3 rounded-full bg-primary" />
                  </div>
                  {i < timeline.length - 1 && (
                    <span className="my-1 w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="-mt-1 pb-10">
                  <div className="font-heading text-xl font-bold text-primary">
                    {item.year}
                  </div>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="border-t border-border bg-card/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Working alongside the world&apos;s leading carriers
          </p>
          <PartnersMarquee className="mt-8" />
        </div>
      </section>

      <CTA />
    </>
  )
}
