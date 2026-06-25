'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react'
import { Pasajero, RiderMetricas } from '@/lib/services/rider'
import TogglePasajeroButton from './TogglePasajeroButton'
import { deletePasajeroAction } from './actions'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Props {
  initialPasajeros: Pasajero[]
  total: number
  currentPage: number
  totalPages: number
  currentQ: string
  metricas: RiderMetricas | null
}

export default function PasajerosClient({
  initialPasajeros,
  total,
  currentPage,
  totalPages,
  currentQ,
  metricas,
}: Props) {
  const [pasajeros, setPasajeros] = useState<Pasajero[]>(initialPasajeros)
  const [searchValue, setSearchValue] = useState(currentQ)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; nombre: string } | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const handleToggle = (id: string, newStatus: boolean) => {
    setPasajeros(prev => prev.map(p => p.id_pasajero === id ? { ...p, activo: newStatus } : p))
  }

  const handleDelete = (id: string, nombre: string) => {
    setPendingDelete({ id, nombre })
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const { id } = pendingDelete
    const pasajeroToRestore = pasajeros.find(p => p.id_pasajero === id)
    setPendingDelete(null)
    setPasajeros(prev => prev.filter(p => p.id_pasajero !== id))
    const ok = await deletePasajeroAction(id)
    if (!ok) {
      if (pasajeroToRestore) setPasajeros(prev => [...prev, pasajeroToRestore])
      setDeleteError('No se pudo eliminar el pasajero. Intentá de nuevo.')
    }
  }

  const handleSearch = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchValue.trim()) {
      params.set('q', searchValue.trim())
    } else {
      params.delete('q')
    }
    params.set('page', '1')
    startTransition(() => router.push(`/pasajeros?${params}`))
  }

  return (
    <>
    <ConfirmDialog
      open={!!pendingDelete}
      title="ELIMINAR PASAJERO"
      description={`¿Eliminar a ${pendingDelete?.nombre}? Se borrarán todos sus viajes, solicitudes y transacciones. Esta acción no se puede deshacer.`}
      confirmLabel="ELIMINAR"
      onConfirm={confirmDelete}
      onCancel={() => setPendingDelete(null)}
    />
    <div className="space-y-6">
      {/* Métricas */}
      {metricas?.pasajeros && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Total Pasajeros" value={metricas.pasajeros.total} />
          <MetricCard label="Activos" value={metricas.pasajeros.activos} accent="success" />
          <MetricCard label="Bloqueados" value={metricas.pasajeros.inactivos} accent="danger" />
          <MetricCard label="Nuevos 30 días" value={metricas.pasajeros.nuevosUltimos30Dias} accent="info" />
        </div>
      )}

      {/* Header + search */}
      <div className="card-brutalist overflow-hidden">
        <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A]">
          <p className="text-[9px] font-bold tracking-[0.3em] text-text-muted uppercase mb-1">
            RIDER APP // SECTOR CIVIL
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="section-label text-xs">
              UNIDADES REGISTRADAS
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
                  className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-sm pl-8 pr-3 py-1.5 text-[11px] text-white placeholder:text-text-muted tracking-wider focus:outline-none focus:border-primary focus:shadow-[0_0_0_1px_#DC2626] w-48"
                />
              </div>
              <button type="submit" className="btn-secondary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                BUSCAR
              </button>
              {currentQ && (
                <Link
                  href="/pasajeros?page=1"
                  className="btn-secondary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-text-muted"
                >
                  LIMPIAR
                </Link>
              )}
            </form>
          </div>
        </div>

        {/* Error banner */}
        {deleteError && (
          <div className="mx-4 mt-3 px-4 py-2.5 rounded-sm border border-primary/40 bg-[rgba(220,38,38,0.08)] flex items-center justify-between gap-3">
            <span className="text-primary text-[11px] font-bold tracking-wider uppercase">{deleteError}</span>
            <button onClick={() => setDeleteError(null)} className="text-primary/60 hover:text-primary text-xs">✕</button>
          </div>
        )}

        {/* Cards */}
        <div className="divide-y divide-[rgba(220,38,38,0.08)]">
          {pasajeros.map(p => {
            const fecha = new Date(p.fecha_alta)
            const fechaStr = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(fecha)
            const rating = p.rating_promedio != null && !isNaN(Number(p.rating_promedio))
              ? Number(p.rating_promedio).toFixed(1)
              : null

            return (
              <div key={p.id_pasajero} className="p-4 hover:bg-[#141414] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white text-sm font-bold tracking-widest uppercase">{p.nombre}</span>
                      {p.activo ? (
                        <span className="text-success bg-[rgba(5,150,105,0.1)] border border-[rgba(5,150,105,0.3)] px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase">ACTIVA</span>
                      ) : (
                        <span className="text-primary bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-widest uppercase">BLOQUEADA</span>
                      )}
                    </div>
                    <p className="text-text-muted text-xs tracking-wider truncate">{p.email}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {rating && (
                        <span className="text-[10px] font-bold text-white tracking-wider">{rating} ★</span>
                      )}
                      <span className="text-[10px] text-text-muted uppercase tracking-widest">Registro: {fechaStr}</span>
                      {p.telefono && (
                        <span className="text-[10px] text-text-muted tracking-wider">{p.telefono}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <TogglePasajeroButton
                      idPasajero={p.id_pasajero}
                      currentStatus={p.activo}
                      onToggle={handleToggle}
                    />
                    <button
                      onClick={() => handleDelete(p.id_pasajero, p.nombre)}
                      title="Eliminar pasajero"
                      className="btn-secondary border-primary/40 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary p-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {pasajeros.length === 0 && (
            <div className="p-10 text-center text-primary uppercase text-xs tracking-widest font-bold">
              No se detectan unidades en este sector
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[rgba(220,38,38,0.15)] bg-[#0A0A0A] flex items-center justify-between gap-4">
            <PagLink
              href={buildPageUrl(searchParams, currentPage - 1)}
              disabled={currentPage <= 1}
              icon={<ChevronLeft size={12} />}
              label="ANTERIOR"
              iconLeft
            />
            <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">
              PÁGINA <span className="text-white">{currentPage}</span> / {totalPages}
            </span>
            <PagLink
              href={buildPageUrl(searchParams, currentPage + 1)}
              disabled={currentPage >= totalPages}
              icon={<ChevronRight size={12} />}
              label="SIGUIENTE"
            />
          </div>
        )}
      </div>
    </div>
    </>
  )
}

function buildPageUrl(searchParams: ReturnType<typeof useSearchParams>, page: number) {
  const params = new URLSearchParams(searchParams.toString())
  params.set('page', String(page))
  return `/pasajeros?${params}`
}

function PagLink({ href, disabled, icon, label, iconLeft }: { href: string; disabled: boolean; icon: React.ReactNode; label: string; iconLeft?: boolean }) {
  return (
    <Link
      href={href}
      aria-disabled={disabled}
      className={`btn-secondary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 ${disabled ? 'opacity-30 pointer-events-none' : ''}`}
    >
      {iconLeft && icon}
      {label}
      {!iconLeft && icon}
    </Link>
  )
}

function MetricCard({ label, value, accent }: { label: string; value: number; accent?: 'success' | 'danger' | 'info' }) {
  const colors = {
    success: 'text-success border-[rgba(5,150,105,0.2)] bg-[rgba(5,150,105,0.05)]',
    danger: 'text-primary border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.05)]',
    info: 'text-info border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.05)]',
  }
  return (
    <div className={`card-brutalist p-4 border ${accent ? colors[accent] : 'border-[rgba(220,38,38,0.15)] bg-[#0A0A0A]'}`}>
      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-text-muted mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${accent ? '' : 'text-white'}`}>{value.toLocaleString()}</p>
    </div>
  )
}
