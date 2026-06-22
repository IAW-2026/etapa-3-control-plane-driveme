'use client'

import { useState } from 'react'
import type { Transaccion } from '@/lib/services/payments'
import { formatCurrency, formatDate } from '@/lib/format'

type EstadoFilter = 'TODOS' | 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO'

const FILTERS: EstadoFilter[] = ['TODOS', 'PENDIENTE', 'CONFIRMADO', 'CANCELADO']

const ESTADO_BADGE: Record<string, { label: string; cls: string }> = {
  PENDIENTE:  { label: 'PENDIENTE',  cls: 'bg-warning/10 text-warning border border-warning/30 shadow-[0_0_8px_rgba(217,119,6,0.3)] animate-pulse' },
  CONFIRMADO: { label: 'CONFIRMADO', cls: 'bg-success/10 text-success border border-success/30' },
  CANCELADO:  { label: 'CANCELADO',  cls: 'bg-primary/10 text-primary border border-primary/30' },
}

const LIQUIDACION_BADGE: Record<string, { label: string; cls: string }> = {
  PENDIENTE: { label: 'PENDIENTE', cls: 'bg-warning/10 text-warning border border-warning/30 shadow-[0_0_8px_rgba(217,119,6,0.3)] animate-pulse' },
  LIQUIDADO: { label: 'LIQUIDADO', cls: 'bg-success/10 text-success border border-success/30' },
}

const METODO_LABEL: Record<string, string> = {
  EFECTIVO:     'EFECTIVO',
  MERCADO_PAGO: 'MERCADO PAGO',
}

export function TransaccionesClient({ transacciones }: { transacciones: Transaccion[] }) {
  const [filtro, setFiltro] = useState<EstadoFilter>('TODOS')

  const filtered =
    filtro === 'TODOS' ? transacciones : transacciones.filter((t) => t.estado === filtro)

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="section-label text-[10px] shrink-0">
          ESTADO
        </span>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-1.5 rounded-sm text-[10px] uppercase font-bold tracking-widest transition-all ${
                filtro === f
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-primary'
                  : 'bg-transparent text-text-muted border border-[rgba(255,255,255,0.1)] hover:border-primary hover:text-white'
              }`}
            >
              {f === 'TODOS' ? 'TODOS' : ESTADO_BADGE[f].label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-primary text-[10px] font-bold uppercase tracking-widest shrink-0">
          {filtered.length} RESULTADO{filtered.length !== 1 ? 'S' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="card-brutalist overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(220,38,38,0.15)] bg-[rgba(20,20,20,0.5)]">
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Pasajero</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Conductor</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Método</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Fecha</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-right">Monto</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Estado</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Liquidación</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const estadoBadge = ESTADO_BADGE[t.estado] ?? { label: t.estado, cls: 'bg-[#141414] text-text-muted border border-[rgba(255,255,255,0.1)]' }
                const liqBadge = LIQUIDACION_BADGE[t.estadoLiquidacion] ?? { label: t.estadoLiquidacion, cls: 'bg-[#141414] text-text-muted border border-[rgba(255,255,255,0.1)]' }
                return (
                  <tr
                    key={t.id}
                    className="border-b border-[rgba(220,38,38,0.08)] last:border-0 hover:bg-[#141414] transition-colors"
                  >
                    <td className="p-3 font-mono text-text-primary text-xs uppercase font-bold tracking-widest">{t.idPasajero}</td>
                    <td className="p-3 font-mono text-text-primary text-xs uppercase font-bold tracking-widest">{t.idConductor}</td>
                    <td className="p-3 text-text-muted text-[10px] font-bold tracking-widest uppercase">{METODO_LABEL[t.metodoPago] ?? t.metodoPago}</td>
                    <td className="p-3 text-text-primary text-xs uppercase tracking-widest whitespace-nowrap">{formatDate(t.fechaCreacion)}</td>
                    <td className="p-3 text-right font-mono font-bold tracking-wider text-white whitespace-nowrap">{formatCurrency(t.monto)}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${estadoBadge.cls}`}>
                        {estadoBadge.label}
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${liqBadge.cls}`}>
                        {liqBadge.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-primary uppercase text-xs tracking-widest font-bold">
            No hay transacciones con el filtro seleccionado
          </div>
        )}
      </div>
    </div>
  )
}
