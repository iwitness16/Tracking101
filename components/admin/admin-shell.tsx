'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { ClipboardList, LogOut, Menu, ShieldCheck, X } from 'lucide-react'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <BrandLogo />
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="p-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Admin Console
            </p>
            <p className="mt-2 text-sm text-foreground">
              Create, publish, and update shipments with live tracking outputs.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <Link
              href="/admin"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === '/admin'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <ClipboardList className="size-4" />
              Create Shipment
            </Link>
            <Link
              href="/admin/updates"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                pathname.startsWith('/admin/updates')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <ClipboardList className="size-4" />
              Update Shipments
            </Link>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4" />
              Protected Access Enabled
            </div>
          </div>
        </nav>
        <div className="absolute inset-x-0 bottom-0 space-y-2 border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Back to site
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="size-4" />
            {loggingOut ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
          <button
            onClick={() => setOpen(true)}
            className="text-muted-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-foreground">
              AtlasSwift Admin Dashboard
            </p>
            <p className="text-xs text-muted-foreground">
              Firestore-backed shipment operations
            </p>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
