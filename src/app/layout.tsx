import type { Metadata } from 'next'
import { Michroma } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

const michroma = Michroma({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-michroma',
})

export const metadata: Metadata = {
  title: 'DriveMe Control Plane',
  description: 'Panel de administración de pagos DriveMe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${michroma.variable}`}>
      <body className="atmospheric-bg text-text-primary min-h-screen font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-4 pt-20 md:p-8 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  )
}
