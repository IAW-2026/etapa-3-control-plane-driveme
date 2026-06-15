import { getBancoCentral } from '@/lib/services/payments'
import { formatCurrency } from '@/lib/format'

export default async function BancoCentralPage() {
  const banco = await getBancoCentral().catch(() => null)

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Banco Central</h1>
        <p className="text-slate-400 text-sm mt-1">Estado detallado del fondo central de la empresa</p>
      </div>

      {banco ? (
        <div className="space-y-4">
          <DetailCard
            label="Fondos Empresa"
            description="Balance total disponible en la cuenta empresa"
            value={banco.fondosEmpresa}
            accent="cyan"
          />
          <DetailCard
            label="Fondos a Debitar"
            description="Monto pendiente de debitarse a conductores"
            value={banco.fondosADebitar}
            accent="violet"
          />
          <DetailCard
            label="Fondos Debitados Histórico"
            description="Total acumulado debitado desde el inicio del sistema"
            value={banco.fondosDebitadosHistorico}
            accent="cyan"
          />
        </div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center text-slate-500 text-sm">
          No se pudo cargar el estado del Banco Central
        </div>
      )}
    </div>
  )
}

function DetailCard({
  label,
  description,
  value,
  accent,
}: {
  label: string
  description: string
  value: number
  accent: 'cyan' | 'violet'
}) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 flex items-center justify-between gap-6">
      <div className="min-w-0">
        <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <p
        className={`font-mono text-3xl font-semibold shrink-0 ${
          accent === 'cyan' ? 'text-cyan-400' : 'text-violet-400'
        }`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  )
}
