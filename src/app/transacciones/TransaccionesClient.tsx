'use client'

import { useState } from 'react'
import type { Transaccion } from '@/lib/services/payments'
import { formatCurrency, formatDate } from '@/lib/format'

type EstadoFilter = 'TODOS' | 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO'

const FILTERS: EstadoFilter[] = ['TODOS', 'PENDIENTE', 'CONFIRMADO', 'CANCELADO']

const ESTADO_BADGE: Record<string, { label: string; cls: string }> = {
  PENDIENTE:  { label: 'Pendiente',  cls: 'bg-amber-400/10 text-amber-400 border border-amber-400/20' },
  CONFIRMADO: { label: 'Confirmado', cls: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' },
  CANCELADO:  { label: 'Cancelado',  cls: 'bg-red-400/10 text-red-400 border border-red-400/20' },
}

const LIQUIDACION_BADGE: Record<string, { label: string; cls: string }> = {
  PENDIENTE: { label: 'Pendiente', cls: 'bg-amber-400/10 text-amber-400 border border-amber-400/20' },
  LIQUIDADO: { label: 'Liquidado', cls: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
}

const METODO_LABEL: Record<string, string> = {
  EFECTIVO:     'Efectivo',
  MERCADO_PAGO: 'Mercado Pago',
}

export function TransaccionesClient({ transacciones }: { transacciones: Transaccion[] }) {
  const [filtro, setFiltro] = useState<EstadoFilter>('TODOS')

  const filtered =
    filtro === 'TODOS' ? transacciones : transacciones.filter((t) => t.estado === filtro)

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-violet-400 text-xs font-semibold uppercase tracking-wider shrink-0">
          Estado
        </span>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtro === f
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-700/50 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {f === 'TODOS' ? 'Todos' : ESTADO_BADGE[f].label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-slate-500 text-sm shrink-0">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-215">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">Pasajero</th>
                <th className="text-left px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">Conductor</th>
                <th className="text-left px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">Método</th>
                <th className="text-left px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">Fecha</th>
                <th className="text-right px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">Monto</th>
                <th className="text-center px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">Estado</th>
                <th className="text-center px-4 py-3 text-slate-400 uppercase text-xs tracking-wider font-medium">Liquidación</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const estadoBadge = ESTADO_BADGE[t.estado] ?? { label: t.estado, cls: 'bg-slate-700/50 text-slate-300 border border-slate-600/50' }
                const liqBadge = LIQUIDACION_BADGE[t.estadoLiquidacion] ?? { label: t.estadoLiquidacion, cls: 'bg-slate-700/50 text-slate-300 border border-slate-600/50' }
                return (
                  <tr
                    key={t.id}
                    className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-slate-400 text-xs">{t.idPasajero}</td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-xs">{t.idConductor}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{METODO_LABEL[t.metodoPago] ?? t.metodoPago}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(t.fechaCreacion)}</td>
                    <td className="px-4 py-3 text-right font-mono text-cyan-400">{formatCurrency(t.monto)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${estadoBadge.cls}`}>
                        {estadoBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${liqBadge.cls}`}>
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
          <div className="py-10 text-center text-slate-500 text-sm">
            No hay transacciones con el filtro seleccionado
          </div>
        )}
      </div>
    </div>
  )
}
