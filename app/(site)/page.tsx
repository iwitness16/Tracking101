import { CTA } from '@/components/home/cta'
import { Features } from '@/components/home/features'
import { GlobalNetwork } from '@/components/home/global-network'
import { Hero } from '@/components/home/hero'
import { ServicesOverview } from '@/components/home/services-overview'
import { Stats } from '@/components/home/stats'
import { Testimonials } from '@/components/home/testimonials'
import { PartnersMarquee } from '@/components/partners-marquee'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted carriers &amp; partners in our network
        </p>
        <PartnersMarquee className="mt-8" />
      </section>

      <ServicesOverview />
      <Features />
      <GlobalNetwork />
      <Testimonials />
      <CTA />
    </>
  )
}
