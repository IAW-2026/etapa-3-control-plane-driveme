import { getBilleteras } from '@/lib/services/payments'
import { formatCurrency } from '@/lib/format'

export default async function BilleterasPage() {
  const billeteras = await getBilleteras().catch(() => null)

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Billeteras</h1>
        <p className="text-slate-400 text-sm mt-1">
          {billeteras ? `${billeteras.length} billeteras de conductores` : 'Error al cargar'}
        </p>
      </div>

      {billeteras ? (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">
                  ID
                </th>
                <th className="text-left px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">
                  Conductor
                </th>
                <th className="text-right px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">
                  Monto Pendiente
                </th>
                <th className="text-right px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">
                  Monto Liquidado
                </th>
              </tr>
            </thead>
            <tbody>
              {billeteras.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-slate-500 text-xs">
                    {b.id.length > 12 ? `${b.id.slice(0, 10)}…` : b.id}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{b.idConductor}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-400">
                    {formatCurrency(b.montoPendiente)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-cyan-400">
                    {formatCurrency(b.montoLiquidado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {billeteras.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm">
              No hay billeteras registradas
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center text-slate-500 text-sm">
          No se pudieron cargar las billeteras
        </div>
      )}
    </div>
  )
}
