import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  breadcrumb?: string
  className?: string
}) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden border-b border-border bg-background',
        className,
      )}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 pt-36 pb-16 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">{breadcrumb ?? title}</span>
        </nav>

        {eyebrow && (
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <span className="h-px w-6 bg-primary" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 max-w-3xl text-balance font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
