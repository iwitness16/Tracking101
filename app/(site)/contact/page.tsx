import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { QuoteForm } from '@/components/contact/quote-form'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { offices } from '@/lib/data'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact & Get a Quote',
  description:
    'Get in touch with AtlasSwift Logistics. Request a tailored shipping quote or reach our global offices for support.',
}

const contactMethods = [
  {
    icon: Phone,
    label: 'Call us',
    value: '+1 (800) 555-0192',
    sub: '24/7 global support line',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'hello@atlasswift.com',
    sub: 'Response within 1 business day',
  },
  {
    icon: Clock,
    label: 'Operating hours',
    value: 'Always on',
    sub: 'Operations run 24/7/365',
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's move your business forward"
        description="Whether you need a quote, a partnership, or operational support, our specialists are ready to help."
      />

      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {contactMethods.map((m, i) => (
            <Reveal key={m.label} delay={i * 80}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <m.icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <p className="font-sans text-lg font-semibold text-card-foreground">
                    {m.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{m.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Get a quote"
                title="Tell us about your shipment"
                description="Fill out the form and our team will craft a solution tailored to your cargo, lanes, and timeline."
              />
              <div className="mt-8">
                <QuoteForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="lg:pl-4">
              <SectionHeading
                align="left"
                eyebrow="Global offices"
                title="Find us around the world"
                description="With regional hubs across every continent, support is always close to your cargo."
              />
              <div className="mt-8 flex flex-col gap-4">
                {offices.map((office) => (
                  <div
                    key={office.city}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-card-foreground">
                        {office.city}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {office.region}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">{office.address}</p>
                      <p className="mt-1 text-sm text-accent">{office.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
