import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { TrackingClient } from '@/components/tracking/tracking-client'

export const metadata: Metadata = {
  title: 'Track Your Shipment',
  description:
    'Track your AtlasSwift Logistics shipment in real time with live map updates, status timeline, and delivery estimates.',
}

export default function TrackingPage() {
  return (
    <>
      <PageHero
        eyebrow="Tracking"
        title="Track your shipment"
        description="Enter your tracking number to see real-time location, status history, and estimated delivery."
      />
      <section className="bg-background py-16 sm:py-20">
        <TrackingClient />
      </section>
    </>
  )
}
