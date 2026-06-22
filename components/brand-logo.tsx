import { cn } from '@/lib/utils'

/**
 * AtlasSwift brand mark + wordmark.
 *
 * To use your own logo image instead of the built-in mark, save your file to
 * `public/images/logo.png` and swap the <BrandMark /> below for:
 *   <img src="/images/logo.png" alt="AtlasSwift Logistics" className="h-9 w-9" />
 */
export function BrandLogo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <BrandMark className="h-9 w-9" />
      {showWordmark && (
        <span className="font-heading text-lg font-extrabold tracking-tight leading-none text-foreground">
          Atlas<span className="text-primary">Swift</span>
        </span>
      )}
    </span>
  )
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="AtlasSwift logo"
      fill="none"
    >
      <defs>
        <linearGradient id="asg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stopColor="oklch(0.62 0.26 22)" />
          <stop offset="1" stopColor="oklch(0.48 0.22 28)" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#asg)" />
      {/* Swift forward arrow / compass */}
      <path
        d="M20 8L29 28L20 23.5L11 28L20 8Z"
        fill="oklch(0.99 0.005 25)"
        fillOpacity="0.95"
      />
      <path d="M20 8L29 28L20 23.5V8Z" fill="oklch(0.99 0.005 25)" />
    </svg>
  )
}
