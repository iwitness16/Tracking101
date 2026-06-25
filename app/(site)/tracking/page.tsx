import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHero } from '@/components/page-hero'
import { TrackingClient } from '@/components/tracking/tracking-client'

export const metadata: Metadata = {
  title: 'Track Your Shipment',
  description:
    'Track your AtlasSwift Logistics shipment using your consignment number with live route progression and published delivery milestones.',
}

export default function TrackingPage() {
  return (
    <>
      <PageHero
        eyebrow="Tracking"
        title="Track your shipment"
        description="Enter your consignment number to view real-time map progress, shipment history, and full package details."
      />
      <section className="bg-background py-16 sm:py-20">
        <Suspense fallback={<div className="mx-auto max-w-6xl px-4 text-center text-muted-foreground">Loading tracker…</div>}>
          <TrackingClient />
        </Suspense>
      </section>
    </>
  )
}
