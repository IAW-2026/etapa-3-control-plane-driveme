import { getTransacciones } from '@/lib/services/payments'
import { TransaccionesClient } from './TransaccionesClient'

export default async function TransaccionesPage() {
  const transacciones = await getTransacciones().catch(() => null)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Transacciones</h1>
        <p className="text-primary text-sm mt-1 uppercase tracking-widest opacity-80">
          {transacciones
            ? `${transacciones.length} transacciones en total`
            : 'Error al cargar'}
        </p>
      </div>

      {transacciones ? (
        <TransaccionesClient transacciones={transacciones} />
      ) : (
        <div className="card-brutalist p-8 text-center text-primary text-xs uppercase tracking-widest font-bold">
          No se pudieron cargar las transacciones
        </div>
      )}
    </div>
  )
}
