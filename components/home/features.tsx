import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import {
  Radar,
  ShieldCheck,
  Headphones,
  Leaf,
  FileCheck2,
  Gauge,
} from 'lucide-react'

const features = [
  {
    icon: Radar,
    title: 'Real-time visibility',
    desc: 'Track every shipment down to the milestone with live GPS, ETAs, and proactive exception alerts.',
  },
  {
    icon: FileCheck2,
    title: 'Customs expertise',
    desc: 'Licensed brokers clear your cargo fast across 180+ countries, minimizing duties and delays.',
  },
  {
    icon: ShieldCheck,
    title: 'Cargo protection',
    desc: 'Comprehensive insurance and certified handling keep your goods secure at every touchpoint.',
  },
  {
    icon: Gauge,
    title: 'Optimized routing',
    desc: 'AI-assisted route planning balances cost, speed, and carbon to hit your priorities every time.',
  },
  {
    icon: Headphones,
    title: '24/7 human support',
    desc: 'A dedicated account team and round-the-clock control tower, wherever your cargo is.',
  },
  {
    icon: Leaf,
    title: 'Greener freight',
    desc: 'Carbon-tracked shipments and sustainable lane options to help you hit your ESG targets.',
  },
]

export function Features() {
  return (
    <section className="relative border-y border-border section-muted">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <SectionHeading
            align="center"
            eyebrow="Why AtlasSwift"
            title="Built on trust, engineered for reliability"
            description="Enterprises choose AtlasSwift because we pair a world-class network with the transparency and service their business depends on."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 100} direction="up">
              <div className="group card-lift h-full rounded-2xl border border-border bg-card p-7 hover:border-primary/30">
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
