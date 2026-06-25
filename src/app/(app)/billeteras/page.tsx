import { Suspense } from 'react'
import { getBilleteras } from '@/lib/services/payments'
import { formatCurrency } from '@/lib/format'
import { LiquidarButton } from './LiquidarButton'

export default function BilleterasPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Billeteras</h1>
        <p className="text-primary text-sm mt-1 uppercase tracking-widest opacity-80">Billeteras de conductores</p>
      </div>
      <Suspense fallback={<Loading />}>
        <BilleterasData />
      </Suspense>
    </div>
  )
}

async function BilleterasData() {
  const billeteras = await getBilleteras().catch(() => null)

  if (!billeteras) {
    return (
      <div className="card-brutalist p-8 text-center text-primary text-xs uppercase tracking-widest font-bold">
        No se pudieron cargar las billeteras
      </div>
    )
  }

  return (
    <div className="card-brutalist overflow-hidden">
      <table className="w-full text-sm border-collapse text-left">
        <thead>
          <tr className="border-b border-[rgba(220,38,38,0.15)] bg-[rgba(20,20,20,0.5)]">
            <th className="px-4 py-3 text-text-secondary uppercase text-[10px] tracking-widest font-bold">
              Conductor
            </th>
            <th className="text-right px-4 py-3 text-text-secondary uppercase text-[10px] tracking-widest font-bold">
              Monto Pendiente
            </th>
            <th className="text-right px-4 py-3 text-text-secondary uppercase text-[10px] tracking-widest font-bold">
              Monto Liquidado
            </th>
            <th className="text-center px-4 py-3 text-text-secondary uppercase text-[10px] tracking-widest font-bold">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {billeteras.map((b) => (
            <tr
              key={b.id}
              className="border-b border-[rgba(220,38,38,0.08)] last:border-0 hover:bg-[#141414] transition-colors"
            >
              <td className="px-4 py-3 font-mono text-text-primary text-xs font-bold uppercase tracking-widest">{b.idConductor}</td>
              <td className="px-4 py-3 text-right font-mono text-warning font-bold tracking-wider">
                {formatCurrency(b.montoPendiente)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-success font-bold tracking-wider">
                {formatCurrency(b.montoLiquidado)}
              </td>
              <td className="px-4 py-3 text-center">
                {b.montoPendiente > 0 ? (
                  <LiquidarButton idConductor={b.idConductor} />
                ) : (
                  <span className="text-text-muted text-[10px] tracking-widest font-bold">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {billeteras.length === 0 && (
        <div className="py-8 text-center text-primary uppercase text-xs tracking-widest font-bold">
          No hay billeteras registradas
        </div>
      )}
    </div>
  )
}

function Loading() {
  return (
    <div className="card-brutalist p-8 text-center text-text-muted text-xs uppercase tracking-widest animate-pulse">
      Cargando...
    </div>
  )
}
