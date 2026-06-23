import { getViajes } from '@/lib/services/viajes'
import ViajesClient from './ViajesClient'

export const dynamic = 'force-dynamic'

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
          <h1 className="text-lg md:text-2xl font-bold text-white uppercase tracking-widest leading-tight">Registro de Viajes</h1>
          <p className="text-primary text-[10px] md:text-sm mt-1 uppercase tracking-widest opacity-80 leading-relaxed">Historial completo de los viajes realizados en la plataforma.</p>
        </div>
      </div>
      
      <ViajesClient initialViajes={viajes} total={total} currentPage={page} />
    </div>
  )
}
