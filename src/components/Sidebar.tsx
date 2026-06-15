'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Landmark,
  ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface NavRoute {
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

interface App {
  name: string
  accentColor: string
  dotColor: string
  routes: NavRoute[]
}

const APPS: App[] = [
  {
    name: 'Payments App',
    accentColor: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    routes: [
      { href: '/dashboard',     label: 'Dashboard',     Icon: LayoutDashboard },
      { href: '/transacciones', label: 'Transacciones', Icon: ArrowLeftRight },
      { href: '/billeteras',    label: 'Billeteras',    Icon: Wallet },
      { href: '/banco-central', label: 'Banco Central', Icon: Landmark },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const initialOpen = APPS.map((app) =>
    app.routes.some((r) => pathname === r.href || pathname.startsWith(r.href + '/'))
  )

  const [openStates, setOpenStates] = useState<boolean[]>(() =>
    initialOpen.some(Boolean) ? initialOpen : APPS.map((_, i) => i === 0)
  )

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
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
          </div>
          <span className="text-white font-semibold text-base tracking-tight">
            DriveMe Control
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
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
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                    hasActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-sm shrink-0',
                        app.dotColor,
                        !hasActive && 'opacity-50'
                      )}
                    />
                    <span className="font-medium">{app.name}</span>
                  </div>
                  <ChevronRight
                    size={13}
                    strokeWidth={2}
                    className={cn(
                      'transition-transform duration-200 text-slate-500',
                      isOpen && 'rotate-90'
                    )}
                  />
                </button>

                {/* Sub-routes */}
                {isOpen && (
                  <ul className="mt-0.5 ml-3 pl-3 border-l border-slate-700/60 space-y-0.5">
                    {app.routes.map(({ href, label, Icon }) => {
                      const active =
                        pathname === href || pathname.startsWith(href + '/')
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                              active
                                ? 'bg-slate-800/80 text-white'
                                : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300'
                            )}
                          >
                            <Icon
                              size={13}
                              strokeWidth={active ? 2 : 1.5}
                              className={active ? app.accentColor : ''}
                            />
                            <span className={active ? 'text-white' : ''}>{label}</span>
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
      <div className="px-5 py-4 border-t border-slate-700/50 shrink-0">
        <p className="text-xs text-slate-600">Control Plane · v1.0</p>
      </div>
    </aside>
  )
}
