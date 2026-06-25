'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, Send } from 'lucide-react'

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="font-sans text-xl font-semibold text-card-foreground">
          Request received
        </h3>
        <p className="max-w-sm text-pretty text-muted-foreground leading-relaxed">
          Thank you. One of our logistics specialists will get back to you within one
          business day with a tailored quote.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Submit another request
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" placeholder="Jane" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" placeholder="Doe" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="jane@company.com" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="+1 (825) 929-3315" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="service">Service type</Label>
          <Select>
            <SelectTrigger id="service">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="air">Air Freight</SelectItem>
              <SelectItem value="ocean">Ocean Freight</SelectItem>
              <SelectItem value="ground">Ground Transport</SelectItem>
              <SelectItem value="warehouse">Warehousing</SelectItem>
              <SelectItem value="lastmile">Last-Mile Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cargo">Estimated weight / volume</Label>
          <Input id="cargo" placeholder="e.g. 12 pallets, 4,500 kg" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="origin">Origin</Label>
          <Input id="origin" placeholder="City, Country" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="destination">Destination</Label>
          <Input id="destination" placeholder="City, Country" />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="message">Shipment details</Label>
          <Textarea
            id="message"
            rows={4}
            placeholder="Tell us about your cargo, timeline, and any special requirements."
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="mt-6 w-full gap-2 sm:w-auto">
        <Send className="size-4" />
        Request a quote
      </Button>
    </form>
  )
}
