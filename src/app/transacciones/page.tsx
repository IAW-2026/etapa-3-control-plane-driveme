import { getTransacciones } from '@/lib/services/payments'
import { TransaccionesClient } from './TransaccionesClient'

export default async function TransaccionesPage() {
  const transacciones = await getTransacciones().catch(() => null)

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Transacciones</h1>
        <p className="text-slate-400 text-sm mt-1">
          {transacciones
            ? `${transacciones.length} transacciones en total`
            : 'Error al cargar'}
        </p>
      </div>

      {transacciones ? (
        <TransaccionesClient transacciones={transacciones} />
      ) : (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center text-slate-500 text-sm">
          No se pudieron cargar las transacciones
        </div>
      )}
    </div>
  )
}
