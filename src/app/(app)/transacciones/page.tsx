import { Suspense } from 'react'
import { getTransacciones } from '@/lib/services/payments'
import { TransaccionesClient } from './TransaccionesClient'

export default function TransaccionesPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Transacciones</h1>
        <p className="text-primary text-sm mt-1 uppercase tracking-widest opacity-80">Historial de transacciones</p>
      </div>
      <Suspense fallback={<Loading />}>
        <TransaccionesData />
      </Suspense>
    </div>
  )
}

async function TransaccionesData() {
  const transacciones = await getTransacciones().catch(() => null)

  if (!transacciones) {
    return (
      <div className="card-brutalist p-8 text-center text-primary text-xs uppercase tracking-widest font-bold">
        No se pudieron cargar las transacciones
      </div>
    )
  }

  return <TransaccionesClient transacciones={transacciones} />
}

function Loading() {
  return (
    <div className="card-brutalist p-8 text-center text-text-muted text-xs uppercase tracking-widest animate-pulse">
      Cargando...
    </div>
  )
}
