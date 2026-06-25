'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Landmark,
  ChevronRight,
  CarFront,
  Route,
  Menu,
  X,
  Crosshair,
  Flag,
  Users,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { UserButton, useUser } from '@clerk/nextjs'

interface NavRoute {
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

interface App {
  name: string
  routes: NavRoute[]
}

const APPS: App[] = [
  {
    name: 'Payments App',
    routes: [
      { href: '/dashboard',     label: 'Dashboard',     Icon: LayoutDashboard },
      { href: '/transacciones', label: 'Transacciones', Icon: ArrowLeftRight },
      { href: '/billeteras',    label: 'Billeteras',    Icon: Wallet },
      { href: '/banco-central', label: 'Banco Central', Icon: Landmark },
    ],
  },
  {
    name: 'Driver App',
    routes: [
      { href: '/conductores', label: 'Conductores', Icon: CarFront },
      { href: '/viajes', label: 'Viajes', Icon: Route },
    ],
  },
  {
    name: 'Rider App',
    routes: [
      { href: '/pasajeros', label: 'Pasajeros', Icon: Users },
    ],
  },
  {
    name: 'Feedback App',
    routes: [
      { href: '/feedback', label: 'Moderación', Icon: Flag },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  const initialOpen = APPS.map((app) =>
    app.routes.some((r) => pathname === r.href || pathname.startsWith(r.href + '/'))
  )

  const [openStates, setOpenStates] = useState<boolean[]>(() =>
    initialOpen.some(Boolean) ? initialOpen : APPS.map((_, i) => i === 0)
  )

  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    setOpenStates((prev) =>
      APPS.map((app, i) => {
        const hasActive = app.routes.some(
          (r) => pathname === r.href || pathname.startsWith(r.href + '/')
        )
        return hasActive ? true : prev[i]
      })
    )
  }, [pathname])

  const toggleApp = (index: number) => {
    setOpenStates((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        className="md:hidden fixed top-5 left-5 z-[60] p-2 rounded-lg bg-[#0A0A0A] text-text-muted hover:text-white border border-[rgba(220,38,38,0.15)] shadow-[0_0_15px_rgba(220,38,38,0.1)] transition-all"
      >
        {mobileOpen ? <X size={20} className="text-primary" /> : <Menu size={20} className="text-primary" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#050505]/90 z-[40] backdrop-blur-md transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-[#0A0A0A] backdrop-blur-md border-r border-[rgba(220,38,38,0.15)] flex flex-col z-50 transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[rgba(220,38,38,0.15)] shrink-0 md:pl-5 pl-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-primary flex items-center justify-center shrink-0 bg-[rgba(220,38,38,0.05)] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <Crosshair size={18} className="text-primary" />
            </div>
            <span className="text-white font-bold text-base tracking-widest uppercase">
              DriveMe
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-4">
            {APPS.map((app, appIndex) => {
              const isOpen = openStates[appIndex]
              const hasActive = app.routes.some(
                (r) => pathname === r.href || pathname.startsWith(r.href + '/')
              )

              return (
                <li key={app.name}>
                  {/* App header */}
                  <button
                    onClick={() => toggleApp(appIndex)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-colors section-label',
                      hasActive
                        ? 'text-primary'
                        : 'text-text-muted hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold tracking-[0.2em]">{app.name}</span>
                    </div>
                    <ChevronRight
                      size={14}
                      strokeWidth={2}
                      className={cn(
                        'transition-transform duration-200 text-primary',
                        isOpen && 'rotate-90'
                      )}
                    />
                  </button>

                  {/* Sub-routes */}
                  {isOpen && (
                    <ul className="mt-2 ml-3 pl-3 border-l border-[rgba(220,38,38,0.15)] space-y-1">
                      {app.routes.map(({ href, label, Icon }) => {
                        const active =
                          pathname === href || pathname.startsWith(href + '/')
                        return (
                          <li key={href}>
                            <Link
                              href={href}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150',
                                active
                                  ? 'bg-[rgba(220,38,38,0.08)] text-white border border-[rgba(220,38,38,0.3)] shadow-[0_0_15px_rgba(220,38,38,0.1)]'
                                  : 'text-text-muted hover:bg-[#141414] hover:text-white border border-transparent'
                              )}
                            >
                              <Icon
                                size={14}
                                strokeWidth={active ? 2 : 1.5}
                                className={active ? 'text-primary' : 'text-text-muted'}
                              />
                              <span className={cn('tracking-wide', active ? 'text-white' : '')}>{label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[rgba(220,38,38,0.15)] shrink-0 space-y-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8 rounded border border-[rgba(220,38,38,0.3)] shadow-[0_0_10px_rgba(220,38,38,0.1)]',
                  userButtonPopoverCard: 'bg-[#0A0A0A] border border-[rgba(220,38,38,0.15)] shadow-[0_0_30px_rgba(220,38,38,0.1)]',
                  userButtonPopoverActionButton: 'text-text-muted hover:text-white hover:bg-[#141414]',
                  userButtonPopoverActionButtonText: 'text-xs uppercase tracking-widest',
                  userButtonPopoverFooter: 'hidden',
                },
              }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate leading-tight">
                {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? '—'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-primary/60 leading-tight">Admin</span>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-primary/30">Control Plane // v1.0</p>
        </div>
      </aside>
    </>
  )
}
