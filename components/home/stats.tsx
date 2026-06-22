import { CountUp } from '@/components/count-up'
import { Reveal } from '@/components/reveal'

const stats = [
  { value: 180, suffix: '+', label: 'Countries served' },
  { value: 4.2, suffix: 'M', decimals: 1, label: 'Shipments per year' },
  { value: 99.4, suffix: '%', decimals: 1, label: 'On-time delivery' },
  { value: 38, suffix: '', label: 'Global hubs' },
]

export function Stats() {
  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden bg-border px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 80}
            direction="scale"
            className="flex flex-col items-center justify-center bg-background py-12 text-center"
          >
            <div className="font-heading text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
              <CountUp
                end={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals ?? 0}
              />
            </div>
            <div className="mt-2 text-sm font-medium text-muted-foreground">
              {stat.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
