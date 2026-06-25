'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react'
import { Solicitud } from '@/lib/services/rider'
import { deleteSolicitudAction } from './actions'
import ConfirmDialog from '@/components/ConfirmDialog'

const ESTADOS = [
  '',
  'PENDIENTE_PAGO',
  'BUSCANDO_CONDUCTOR',
  'ACEPTADA',
  'CANCELADA_POR_PASAJERO',
  'EXPIRADA_SIN_ACEPTACION',
  'PAGO_RECHAZADO',
]

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE_PAGO: 'PAGO PEND.',
  BUSCANDO_CONDUCTOR: 'BUSCANDO',
  ACEPTADA: 'ACEPTADA',
  CANCELADA_POR_PASAJERO: 'CANCELADA',
  EXPIRADA_SIN_ACEPTACION: 'EXPIRADA',
  PAGO_RECHAZADO: 'PAGO RECH.',
}

const ESTADO_STYLES: Record<string, string> = {
  PENDIENTE_PAGO: 'text-warning bg-[rgba(217,119,6,0.1)] border-warning/30',
  BUSCANDO_CONDUCTOR: 'text-info bg-[rgba(59,130,246,0.1)] border-info/30',
  ACEPTADA: 'text-success bg-[rgba(5,150,105,0.1)] border-success/30',
  CANCELADA_POR_PASAJERO: 'text-primary bg-[rgba(220,38,38,0.1)] border-primary/30',
  EXPIRADA_SIN_ACEPTACION: 'text-text-muted bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.1)]',
  PAGO_RECHAZADO: 'text-primary bg-[rgba(220,38,38,0.1)] border-primary/30',
}

interface Props {
  initialSolicitudes: Solicitud[]
  total: number
  currentPage: number
  totalPages: number
  currentEstado: string
  currentQ: string
}

export default function SolicitudesClient({
  initialSolicitudes,
  total,
  currentPage,
  totalPages,
  currentEstado,
  currentQ,
}: Props) {
  const [solicitudes, setSolicitudes] = useState(initialSolicitudes)
  const [searchValue, setSearchValue] = useState(currentQ)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const handleDelete = (id: string) => setPendingDeleteId(id)

  const confirmDelete = async () => {
    if (!pendingDeleteId) return
    const id = pendingDeleteId
    setPendingDeleteId(null)
    setDeletingId(id)
    const ok = await deleteSolicitudAction(id)
    if (ok) setSolicitudes(prev => prev.filter(s => s.id_solicitud !== id))
    setDeletingId(null)
  }

  const handleSearch = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchValue.trim()) params.set('q', searchValue.trim())
    else params.delete('q')
    params.set('page', '1')
    startTransition(() => router.push(`/solicitudes?${params}`))
  }

  const setEstado = (estado: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (estado) params.set('estado', estado)
    else params.delete('estado')
    params.set('page', '1')
    router.push(`/solicitudes?${params}`)
  }

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d))

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)

  const formatCoord = (c: { lat: number; lng: number }) =>
    `${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`

  return (
    <>
    <ConfirmDialog
      open={!!pendingDeleteId}
      title="ELIMINAR SOLICITUD"
      description="¿Eliminar esta solicitud? Se eliminará también el viaje y las transacciones asociadas. Esta acción no se puede deshacer."
      confirmLabel="ELIMINAR"
      onConfirm={confirmDelete}
      onCancel={() => setPendingDeleteId(null)}
    />
    <div className="card-brutalist overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="section-label text-xs">
            SOLICITUDES
            <span className="ml-2 text-white bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.25)] px-2 py-0.5 rounded-sm text-[10px] font-mono tracking-widest">
              {total}
            </span>
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Nombre o email..."
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm pl-8 pr-3 py-1.5 text-[11px] text-white placeholder:text-text-muted tracking-wider focus:outline-none focus:border-primary focus:shadow-[0_0_0_1px_#DC2626] w-44"
              />
            </div>
            <button type="submit" className="btn-secondary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
              BUSCAR
            </button>
          </form>
        </div>

        {/* Filtro estado */}
        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map(e => (
            <button
              key={e}
              onClick={() => setEstado(e)}
              className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm border transition-colors ${
                currentEstado === e
                  ? 'border-primary text-white bg-[rgba(220,38,38,0.1)]'
                  : 'border-[rgba(255,255,255,0.1)] text-text-muted hover:border-primary/50 hover:text-white'
              }`}
            >
              {e ? (ESTADO_LABELS[e] ?? e) : 'TODOS'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="divide-y divide-[rgba(220,38,38,0.08)]">
        {solicitudes.map(s => (
          <div key={s.id_solicitud} className="p-4 hover:bg-[#141414] transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                {/* Pasajero + estado */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-bold tracking-widest uppercase">{s.pasajero.nombre}</span>
                  <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase border ${ESTADO_STYLES[s.estado] ?? 'text-text-muted border-text-muted/30'}`}>
                    {ESTADO_LABELS[s.estado] ?? s.estado}
                  </span>
                </div>
                <p className="text-text-muted text-xs tracking-wider">{s.pasajero.email}</p>

                {/* Origen → Destino */}
                <div className="flex items-start gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-sm bg-info shadow-[0_0_6px_rgba(59,130,246,0.6)] shrink-0 mt-1" />
                  <span className="text-text-muted font-mono">{formatCoord(s.origen)}</span>
                </div>
                <div className="flex items-start gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary shadow-[0_0_6px_rgba(220,38,38,0.6)] shrink-0 mt-1" />
                  <span className="text-text-muted font-mono">{formatCoord(s.destino)}</span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-white text-xs font-bold font-mono">{formatCurrency(s.precio_estimado)}</span>
                  <span className="text-text-muted text-[10px] uppercase tracking-widest">{s.metodo_pago}</span>
                  <span className="text-text-muted text-[10px] uppercase tracking-widest">{formatDate(s.creada_en)}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(s.id_solicitud)}
                disabled={deletingId === s.id_solicitud}
                title="Eliminar solicitud"
                className="shrink-0 btn-secondary border-primary/40 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary p-2 disabled:opacity-50 disabled:cursor-wait"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {solicitudes.length === 0 && (
          <div className="p-10 text-center text-primary uppercase text-xs tracking-widest font-bold">
            No se encontraron solicitudes
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[rgba(220,38,38,0.15)] bg-[#0A0A0A] flex items-center justify-between gap-4">
          <PagLink href={buildPageUrl(searchParams, currentPage - 1)} disabled={currentPage <= 1} icon={<ChevronLeft size={12} />} label="ANTERIOR" iconLeft />
          <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">
            PÁGINA <span className="text-white">{currentPage}</span> / {totalPages}
          </span>
          <PagLink href={buildPageUrl(searchParams, currentPage + 1)} disabled={currentPage >= totalPages} icon={<ChevronRight size={12} />} label="SIGUIENTE" />
        </div>
      )}
    </div>
    </>
  )
}

function buildPageUrl(searchParams: ReturnType<typeof useSearchParams>, page: number) {
  const params = new URLSearchParams(searchParams.toString())
  params.set('page', String(page))
  return `/solicitudes?${params}`
}

function PagLink({ href, disabled, icon, label, iconLeft }: { href: string; disabled: boolean; icon: React.ReactNode; label: string; iconLeft?: boolean }) {
  return (
    <Link
      href={href}
      aria-disabled={disabled}
      className={`btn-secondary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 ${disabled ? 'opacity-30 pointer-events-none' : ''}`}
    >
      {iconLeft && icon}{label}{!iconLeft && icon}
    </Link>
  )
}
