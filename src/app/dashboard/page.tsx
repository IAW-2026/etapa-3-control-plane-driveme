import { getBancoCentral, getBilleteras } from '@/lib/services/payments'
import { formatCurrency } from '@/lib/format'

export default async function DashboardPage() {
  const [banco, billeteras] = await Promise.all([
    getBancoCentral().catch(() => null),
    getBilleteras().catch(() => null),
  ])

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Métricas globales del sistema de pagos</p>
      </div>

      {/* Metric Cards */}
      <section>
        <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Banco Central
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="Fondos Empresa" value={banco?.fondosEmpresa} accent="cyan" />
          <MetricCard label="Fondos a Debitar" value={banco?.fondosADebitar} accent="violet" />
          <MetricCard
            label="Debitados Histórico"
            value={banco?.fondosDebitadosHistorico}
            accent="cyan"
          />
        </div>
      </section>

      {/* Billeteras summary */}
      <section>
        <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Billeteras — Vista Resumida
        </p>
        {billeteras ? (
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <Th>Conductor</Th>
                  <Th align="right">Pendiente</Th>
                  <Th align="right">Liquidado</Th>
                </tr>
              </thead>
              <tbody>
                {billeteras.slice(0, 10).map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-300">
                      {b.idConductor}
                    </td>
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
            {billeteras.length > 10 && (
              <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-800/50">
                Mostrando 10 de {billeteras.length} billeteras —{' '}
                <a href="/billeteras" className="text-cyan-400 hover:underline">
                  ver todas
                </a>
              </div>
            )}
          </div>
        ) : (
          <EmptyState message="No se pudieron cargar las billeteras" />
        )}
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string
  value?: number | null
  accent: 'cyan' | 'violet'
}) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
      <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-3">
        {label}
      </p>
      <p
        className={`font-mono text-2xl font-semibold ${
          accent === 'cyan' ? 'text-cyan-400' : 'text-violet-400'
        }`}
      >
        {value != null ? formatCurrency(value) : '—'}
      </p>
    </div>
  )
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className={`px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium text-${align}`}
    >
      {children}
    </th>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center text-slate-500 text-sm">
      {message}
    </div>
  )
}
