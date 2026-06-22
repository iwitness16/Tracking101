import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { testimonials } from '@/lib/data'
import { Quote, Star } from 'lucide-react'

export function Testimonials() {
  return (
    <section className="relative border-y border-border section-muted">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <SectionHeading
            align="center"
            eyebrow="Trusted by leaders"
            title="What our partners say"
            description="Supply chain teams around the world rely on AtlasSwift to keep their promises to their customers."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110} direction="up">
              <figure className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-7 hover:border-primary/25">
                <Quote className="size-8 text-primary/30" />
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="size-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <img
                    src={t.avatar || '/placeholder.svg'}
                    alt={t.name}
                    className="size-11 rounded-full object-cover ring-2 ring-primary/10"
                  />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
