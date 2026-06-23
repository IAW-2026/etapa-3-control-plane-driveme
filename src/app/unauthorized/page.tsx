import Link from 'next/link'
import { Crosshair } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded border border-primary flex items-center justify-center bg-[rgba(220,38,38,0.05)] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
        <Crosshair size={20} className="text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Acceso denegado</h1>
      <p className="text-text-muted text-sm">No tenés permisos para acceder al Control Plane.</p>
      <Link href="/" className="text-primary hover:text-primary/80 text-sm transition-colors uppercase tracking-widest text-xs">
        Volver al inicio
      </Link>
    </div>
  )
}
