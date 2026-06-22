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
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1 uppercase tracking-wider">Métricas globales del sistema de pagos</p>
      </div>

      {/* Metric Cards */}
      <section>
        <p className="section-label text-xs mb-4">
          Banco Central
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="Fondos Empresa" value={banco?.fondosEmpresa} />
          <MetricCard label="Fondos a Debitar" value={banco?.fondosADebitar} accent="danger" />
          <MetricCard
            label="Debitados Histórico"
            value={banco?.fondosDebitadosHistorico}
          />
        </div>
      </section>

      {/* Billeteras summary */}
      <section>
        <p className="section-label text-xs mb-4">
          Billeteras — Vista Resumida
        </p>
        {billeteras ? (
          <div className="card-brutalist overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(220,38,38,0.15)] bg-[rgba(20,20,20,0.5)]">
                  <Th>Conductor</Th>
                  <Th align="right">Pendiente</Th>
                  <Th align="right">Liquidado</Th>
                </tr>
              </thead>
              <tbody>
                {billeteras.slice(0, 10).map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-[rgba(220,38,38,0.08)] last:border-0 hover:bg-[#141414] transition-colors"
                  >
                    <td className="px-4 py-3 text-text-primary uppercase tracking-wider text-xs font-bold">
                      {b.idConductor}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-warning font-bold">
                      {formatCurrency(b.montoPendiente)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-success font-bold">
                      {formatCurrency(b.montoLiquidado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {billeteras.length > 10 && (
              <div className="px-4 py-3 text-xs text-text-muted border-t border-[rgba(220,38,38,0.15)] uppercase tracking-widest text-center">
                Mostrando 10 de {billeteras.length} billeteras —{' '}
                <a href="/billeteras" className="text-primary hover:text-primary-hover font-bold ml-1 transition-colors">
                  VER TODAS
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
  accent = 'neutral',
}: {
  label: string
  value?: number | null
  accent?: 'neutral' | 'danger'
}) {
  return (
    <div className="card-brutalist p-6">
      <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-3">
        {label}
      </p>
      <p
        className={`font-mono text-2xl font-bold tracking-tight ${
          accent === 'danger' ? 'text-primary' : 'text-white'
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
      className={`px-4 py-3 text-text-muted uppercase text-[10px] tracking-widest font-bold text-${align}`}
    >
      {children}
    </th>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="card-brutalist p-8 text-center text-primary uppercase text-xs tracking-widest font-bold">
      {message}
    </div>
  )
}
