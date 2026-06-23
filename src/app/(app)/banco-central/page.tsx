import { getBancoCentral } from '@/lib/services/payments'
import { formatCurrency } from '@/lib/format'

export default async function BancoCentralPage() {
  const banco = await getBancoCentral().catch(() => null)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Banco Central</h1>
        <p className="text-primary text-sm mt-1 uppercase tracking-widest opacity-80">Estado detallado del fondo central de la empresa</p>
      </div>

      {banco ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard
            label="Fondos Empresa"
            description="Balance total disponible en la cuenta empresa"
            value={banco.fondosEmpresa}
            accent="info"
          />
          <DetailCard
            label="Fondos a Debitar"
            description="Monto pendiente de debitarse a conductores"
            value={banco.fondosADebitar}
            accent="primary"
          />
          <div className="md:col-span-2">
            <DetailCard
              label="Fondos Debitados Histórico"
              description="Total acumulado debitado desde el inicio del sistema"
              value={banco.fondosDebitadosHistorico}
              accent="success"
            />
          </div>
        </div>
      ) : (
        <div className="card-brutalist p-8 text-center text-primary text-xs uppercase tracking-widest font-bold">
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
  accent: 'info' | 'primary' | 'success'
}) {
  const accentClasses = {
    info: 'text-info border-[rgba(59,130,246,0.3)] shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    primary: 'text-primary border-[rgba(220,38,38,0.3)] shadow-[0_0_15px_rgba(220,38,38,0.1)] animate-pulse',
    success: 'text-success border-[rgba(5,150,105,0.3)] shadow-[0_0_15px_rgba(5,150,105,0.1)]',
  }

  return (
    <div className={`card-brutalist p-6 flex flex-col gap-4 justify-between ${accentClasses[accent]}`}>
      <div className="min-w-0 border-b border-[rgba(255,255,255,0.05)] pb-4">
        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-sm ${accent === 'info' ? 'bg-info' : accent === 'primary' ? 'bg-primary' : 'bg-success'}`} />
          {label}
        </p>
        <p className="text-text-muted text-xs uppercase tracking-wider opacity-80">{description}</p>
      </div>
      <p className={`font-mono text-3xl font-bold shrink-0 text-white tracking-wider`}>
        {formatCurrency(value)}
      </p>
    </div>
  )
}
