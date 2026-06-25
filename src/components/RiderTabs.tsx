'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/pasajeros', label: 'Pasajeros' },
  { href: '/solicitudes', label: 'Solicitudes' },
]

export default function RiderTabs() {
  const pathname = usePathname()

  return (
    <div className="flex border-b border-[rgba(220,38,38,0.15)] mb-6">
      {TABS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-5 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all border-b-2 -mb-[1px]',
              active
                ? 'border-primary text-white'
                : 'border-transparent text-text-muted hover:text-white hover:border-[rgba(220,38,38,0.4)]'
            )}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
