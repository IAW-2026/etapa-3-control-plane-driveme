'use client'

import { useState } from 'react'
import { Filter, Check } from 'lucide-react'
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

const ID_INPUT_CLS = 'bg-transparent border border-[rgba(255,255,255,0.1)] hover:border-[rgba(220,38,38,0.3)] focus:border-primary focus:outline-none rounded-sm px-3 py-1.5 text-[10px] font-mono text-text-primary placeholder:text-text-muted/40 tracking-widest w-44 transition-colors'
const CLEAR_BTN_CLS = 'text-text-muted hover:text-primary text-[10px] transition-colors leading-none'

function IdCell({ value, onCopy, copied }: { value: string; onCopy: () => void; copied: boolean }) {
  return (
    <td className="p-3 whitespace-nowrap">
      <button
        onClick={onCopy}
        className="flex items-center gap-1.5 group/cell cursor-pointer"
        title="Filtrar por este ID"
      >
        <span className="font-mono text-text-primary group-hover/cell:text-primary text-xs uppercase font-bold tracking-widest truncate max-w-30 transition-colors">
          {value}
        </span>
        {copied
          ? <Check size={11} className="text-success shrink-0" />
          : <Filter size={11} className="text-text-muted/40 group-hover/cell:text-primary shrink-0 transition-colors" />
        }
      </button>
    </td>
  )
}

export function TransaccionesClient({ transacciones }: { transacciones: Transaccion[] }) {
  const [filtro, setFiltro] = useState<EstadoFilter>('TODOS')
  const [conductorId, setConductorId] = useState('')
  const [pasajeroId, setPasajeroId] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = transacciones
    .filter((t) => filtro === 'TODOS' || t.estado === filtro)
    .filter((t) => !conductorId.trim() || t.idConductor.toLowerCase().includes(conductorId.trim().toLowerCase()))
    .filter((t) => !pasajeroId.trim() || t.idPasajero.toLowerCase().includes(pasajeroId.trim().toLowerCase()))

  function applyFilter(id: string, setter: (v: string) => void) {
    setter(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">

        <div className="flex items-center gap-2 shrink-0">
          <span className="section-label text-[10px]">ESTADO</span>
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
        </div>

        <div className="flex items-center gap-3 ml-auto flex-wrap">
          <div className="flex items-center gap-2">
            <span className="section-label text-[10px] shrink-0">PASAJERO</span>
            <input
              type="text"
              value={pasajeroId}
              onChange={(e) => setPasajeroId(e.target.value)}
              placeholder="ID de pasajero..."
              className={ID_INPUT_CLS}
            />
            {pasajeroId && (
              <button onClick={() => setPasajeroId('')} className={CLEAR_BTN_CLS}>✕</button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="section-label text-[10px] shrink-0">CONDUCTOR</span>
            <input
              type="text"
              value={conductorId}
              onChange={(e) => setConductorId(e.target.value)}
              placeholder="ID de conductor..."
              className={ID_INPUT_CLS}
            />
            {conductorId && (
              <button onClick={() => setConductorId('')} className={CLEAR_BTN_CLS}>✕</button>
            )}
          </div>

          <span className="text-primary text-[10px] font-bold uppercase tracking-widest shrink-0">
            {filtered.length} RESULTADO{filtered.length !== 1 ? 'S' : ''}
          </span>
        </div>

      </div>

      <p className="text-[10px] text-text-muted/40 uppercase tracking-widest">
        Hacé click en cualquier ID de pasajero o conductor para filtrar directamente
      </p>

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
                const estadoBadge = ESTADO_BADGE[t.estado] ?? { label: t.estado, cls: 'bg-surface-elevated text-text-muted border border-[rgba(255,255,255,0.1)]' }
                const liqBadge   = LIQUIDACION_BADGE[t.estadoLiquidacion] ?? { label: t.estadoLiquidacion, cls: 'bg-surface-elevated text-text-muted border border-[rgba(255,255,255,0.1)]' }
                return (
                  <tr
                    key={t.id}
                    className="border-b border-[rgba(220,38,38,0.08)] last:border-0 hover:bg-surface-elevated transition-colors"
                  >
                    <IdCell
                      value={t.idPasajero}
                      copied={copiedId === t.idPasajero}
                      onCopy={() => applyFilter(t.idPasajero, setPasajeroId)}
                    />
                    <IdCell
                      value={t.idConductor}
                      copied={copiedId === t.idConductor}
                      onCopy={() => applyFilter(t.idConductor, setConductorId)}
                    />
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
