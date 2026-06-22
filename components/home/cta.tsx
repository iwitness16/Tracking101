import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { ArrowRight, PhoneCall } from 'lucide-react'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal direction="scale">
        <div className="glow-ring relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/5 via-white to-white px-6 py-16 text-center sm:px-12">
          <div className="absolute inset-0 -z-10 opacity-20">
            <img
              src="/images/hero-freight.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/70" />
          </div>
          <h2 className="mx-auto max-w-2xl text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to move your business forward?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Get a tailored logistics plan and a transparent quote within one
            business day. No obligation, no hidden fees.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-6 text-base shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5"
              render={
                <Link href="/contact">
                  Get a Quote
                  <ArrowRight className="size-5" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-foreground/15 bg-white/80 px-6 text-base backdrop-blur transition-transform hover:-translate-y-0.5"
              render={
                <Link href="/contact">
                  <PhoneCall className="size-5" />
                  Talk to an expert
                </Link>
              }
            />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
