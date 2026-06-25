'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/pasajeros', label: 'Pasajeros' },
  { href: '/solicitudes', label: 'Solicitudes' },
]

const RIDER_ADMIN_URL = 'https://proyecto-a-rider-driveme.vercel.app/admin/solicitudes'

export default function RiderTabs() {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between border-b border-[rgba(220,38,38,0.15)] mb-6">
      <div className="flex">
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
      <Link
        href={RIDER_ADMIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 mb-1 shrink-0"
      >
        Panel Admin Rider ↗
      </Link>
    </div>
  )
}
