import { auth, clerkClient } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SignInButton, SignUpButton, SignOutButton, UserButton } from '@clerk/nextjs'
import { Crosshair } from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    if ((user.publicMetadata as { role?: string })?.role === 'admin') {
      redirect('/dashboard')
    }

    const displayName = user.fullName ?? user.emailAddresses[0]?.emailAddress ?? '—'
    const email = user.emailAddresses[0]?.emailAddress

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm bg-surface border border-[rgba(220,38,38,0.15)] rounded-sm shadow-[0_0_40px_rgba(220,38,38,0.05)] p-8 flex flex-col items-center gap-6">

          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded border border-primary flex items-center justify-center bg-[rgba(220,38,38,0.05)] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <Crosshair size={20} className="text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-base font-bold text-white uppercase tracking-widest">DriveMe Control Plane</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary/60 mt-1">Acceso restringido</p>
            </div>
          </div>

          <div className="w-full h-px bg-[rgba(220,38,38,0.15)]" />

          <div className="flex items-center gap-3 w-full">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 rounded border border-[rgba(220,38,38,0.3)] shadow-[0_0_10px_rgba(220,38,38,0.1)]',
                  userButtonPopoverCard: 'bg-surface border border-[rgba(220,38,38,0.15)] shadow-[0_0_30px_rgba(220,38,38,0.1)]',
                  userButtonPopoverActionButton: 'text-text-muted hover:text-white hover:bg-[#141414]',
                  userButtonPopoverActionButtonText: 'text-xs uppercase tracking-widest',
                  userButtonPopoverFooter: 'hidden',
                },
              }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate leading-tight">{displayName}</span>
              {email && <span className="text-text-muted text-[10px] truncate leading-tight">{email}</span>}
            </div>
          </div>

          <div className="w-full h-px bg-[rgba(220,38,38,0.15)]" />

          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <p className="text-text-muted text-sm">Tu cuenta no tiene permisos de administrador.</p>
              <p className="text-text-muted text-xs opacity-60 mt-1">Contactá al equipo de DriveMe para solicitar acceso.</p>
            </div>
            <SignOutButton>
              <button className="px-4 py-2 border border-[rgba(220,38,38,0.3)] hover:border-primary text-text-muted hover:text-white text-xs uppercase tracking-widest transition-all duration-150 rounded-sm w-full hover:bg-[rgba(220,38,38,0.05)] hover:shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:scale-[1.02] active:scale-[0.98]">
                Cerrar sesión
              </button>
            </SignOutButton>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface border border-[rgba(220,38,38,0.15)] rounded-sm shadow-[0_0_40px_rgba(220,38,38,0.05)] p-8 flex flex-col items-center gap-6">

        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded border border-primary flex items-center justify-center bg-[rgba(220,38,38,0.05)] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Crosshair size={20} className="text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-base font-bold text-white uppercase tracking-widest">DriveMe Control Plane</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary/60 mt-1">Panel de administración</p>
          </div>
        </div>

        <div className="w-full h-px bg-[rgba(220,38,38,0.15)]" />

        <div className="flex flex-col gap-3 w-full">
          <SignInButton>
            <button className="w-full px-6 py-2.5 bg-primary hover:bg-primary/80 text-white font-bold rounded-sm text-sm uppercase tracking-widest transition-all duration-150 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98]">
              Iniciar sesión
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="w-full px-6 py-2.5 border border-[rgba(220,38,38,0.3)] hover:border-primary text-text-muted hover:text-white font-bold rounded-sm text-sm uppercase tracking-widest transition-all duration-150 hover:bg-[rgba(220,38,38,0.05)] hover:shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:scale-[1.02] active:scale-[0.98]">
              Registrarse
            </button>
          </SignUpButton>
        </div>

      </div>
    </div>
  )
}
