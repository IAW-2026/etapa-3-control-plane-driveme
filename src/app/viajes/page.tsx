import { getViajes } from '@/lib/services/viajes'
import ViajesClient from './ViajesClient'

export const metadata = {
  title: 'Viajes - Control Plane',
}

export default async function ViajesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1
  const limit = 20
  
  const { viajes, total } = await getViajes(page, limit)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Registro de Viajes</h1>
          <p className="text-slate-400 text-sm mt-1">Historial completo de los viajes realizados en la plataforma.</p>
        </div>
      </div>
      
      <ViajesClient initialViajes={viajes} total={total} currentPage={page} />
    </div>
  )
}
