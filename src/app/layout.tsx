import type { Metadata } from 'next'
import { Michroma } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

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
    <ClerkProvider>
      <html lang="es" className={`${michroma.variable}`}>
        <head>
          <link rel="preconnect" href="https://scdn.clerk.com" />
          <link rel="preconnect" href="https://segapi.clerk.com" />
        </head>
        <body className="atmospheric-bg text-text-primary min-h-screen font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
