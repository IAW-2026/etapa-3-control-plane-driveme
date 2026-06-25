'use client'

import { Viaje } from '@/lib/services/viajes'
import { cancelarViajeAction } from './actions'
import { useState, Fragment, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react'

export default function ViajesClient({ initialViajes, total, currentPage, currentSearch, currentEstado }: { initialViajes: Viaje[], total: number, currentPage: number, currentSearch: string, currentEstado: string }) {
  const [viajes, setViajes] = useState<Viaje[]>(initialViajes)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [estadoValue, setEstadoValue] = useState(currentEstado)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setViajes(initialViajes)
  }, [initialViajes])

  const updateFilters = (newSearch: string, newEstado: string, page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newSearch) params.set('search', newSearch)
    else params.delete('search')

    if (newEstado) params.set('estado', newEstado)
    else params.delete('estado')

    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters(searchValue, estadoValue, 1)
  }

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEstado = e.target.value
    setEstadoValue(newEstado)
    updateFilters(searchValue, newEstado, 1)
  }

  const totalPages = Math.ceil(total / 20) || 1


  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'text-emerald-400 bg-[rgba(5,150,105,0.1)] border border-success/30'
      case 'EN_CURSO': return 'text-amber-300 bg-[rgba(217,119,6,0.1)] border border-warning/30 animate-pulse'
      case 'CANCELADO':
      case 'CANCELADO_POR_CONDUCTOR': return 'text-red-400 bg-[rgba(220,38,38,0.1)] border border-primary/30'
      default: return 'text-info bg-[rgba(59,130,246,0.1)] border border-info/30'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(d)
  }

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de cancelar este viaje a la fuerza?')) return

    setLoadingId(id)
    const success = await cancelarViajeAction(id)
    if (success) {
      setViajes(prev => prev.map(v => v.id_viaje === id ? { ...v, estado_actual: 'CANCELADO_POR_CONDUCTOR' } : v))
    } else {
      alert('Error al cancelar el viaje')
    }
    setLoadingId(null)
  }

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setExpandedIds(newSet)
  }

  return (
    <div className="card-brutalist overflow-hidden flex flex-col">
      <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="section-label text-xs m-0">
          LISTA DE VIAJES ({total})
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href={process.env.NEXT_PUBLIC_DRIVER_APP_URL || 'http://localhost:3000'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-[10px] whitespace-nowrap font-bold tracking-widest bg-[linear-gradient(180deg,#EF4444,#DC2626)] border border-[#991B1B] rounded uppercase text-white hover:border-[#EF4444] transition-colors shadow-[0_0_15px_rgba(220,38,38,0.1)]"
          >
            <ExternalLink size={14} /> DRIVER APP
          </a>
          <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar ID, conductor..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full sm:w-64 bg-[#141414] border border-[rgba(255,255,255,0.1)] text-white text-xs px-3 py-2 pl-8 focus:outline-none focus:border-primary transition-colors"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          </form>

          <select
            value={estadoValue}
            onChange={handleEstadoChange}
            className="w-full sm:w-auto bg-[#141414] border border-[rgba(255,255,255,0.1)] text-white text-xs px-3 py-2 focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">TODOS LOS ESTADOS</option>
            <option value="BUSCANDO_CONDUCTOR">BUSCANDO CONDUCTOR</option>
            <option value="ACEPTADO">ACEPTADO</option>
            <option value="EN_CURSO">EN CURSO</option>
            <option value="FINALIZADO">FINALIZADO</option>
            <option value="CANCELADO">CANCELADO (USUARIO)</option>
            <option value="CANCELADO_POR_CONDUCTOR">CANCELADO (CONDUCTOR/SISTEMA)</option>
          </select>
        </div>
      </div>


      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[radial-gradient(circle_at_top_center,rgba(220,38,38,0.08),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(153,27,27,0.05),transparent_40%),#050505]">
        {viajes.map((v) => {
          const displayId = v.id_viaje.length > 8 ? `${v.id_viaje.slice(0, 8)}...` : v.id_viaje;
          const sClasses = getStatusClasses(v.estado_actual);
          const isExpanded = expandedIds.has(v.id_viaje);
          const displayStatus = v.estado_actual.replace(/_/g, ' ');

          return (
            <div key={v.id_viaje} className={`bg-[rgba(20,20,20,0.8)] backdrop-blur-md border border-[rgba(220,38,38,0.15)] rounded-lg p-5 flex flex-col gap-4 transition-all ${isExpanded ? 'border-[rgba(220,38,38,0.4)] shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'hover:-translate-y-0.5 hover:border-[rgba(220,38,38,0.4)] hover:shadow-[0_0_15px_rgba(220,38,38,0.1)]'}`}>

              <div className="flex justify-between items-start border-b border-[rgba(255,255,255,0.05)] pb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-text-primary text-sm font-mono uppercase font-bold tracking-widest">{displayId}</span>
                  {v.conductor ? (
                    <span className="text-white font-bold tracking-widest uppercase text-xs">{v.conductor.nombre} {v.conductor.apellido}</span>
                  ) : (
                    <span className="text-text-muted italic uppercase text-[10px] tracking-widest">SIN CONDUCTOR</span>
                  )}
                  {v.vehiculo && (
                    <span className="text-text-muted text-[10px] uppercase tracking-widest">{v.vehiculo.patente}</span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded inline-block ${sClasses}`}>
                    {displayStatus}
                  </span>
                  {(v.estado_actual === 'EN_CURSO' || v.estado_actual === 'ACEPTADO') && (
                    <button
                      onClick={() => handleCancel(v.id_viaje)}
                      disabled={loadingId === v.id_viaje}
                      title="Cancelar Viaje"
                      className="btn-secondary p-1.5 border-[rgba(220,38,38,0.3)] text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded"
                    >
                      {loadingId === v.id_viaje ? '...' : <X size={16} />}
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleExpand(v.id_viaje)}
                className="bg-transparent border border-[rgba(156,163,175,0.3)] text-white hover:border-[#DC2626] rounded px-3 py-1.5 text-[10px] whitespace-nowrap font-bold tracking-widest flex items-center justify-center gap-2 transition-colors w-full"
              >
                {isExpanded ? (
                  <><ChevronUp size={14} /> OCULTAR DETALLES</>
                ) : (
                  <><ChevronDown size={14} /> VER DETALLES</>
                )}
              </button>

              {isExpanded && (
                <div className="mt-2 pt-4 border-t border-[rgba(255,255,255,0.05)] grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#141414] p-4 rounded border-[rgba(255,255,255,0.05)]">
                  <div>
                    <p className="text-text-muted text-[10px] font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-sm bg-info" />
                      Información del Viaje
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center bg-[rgba(255,255,255,0.02)] p-2 rounded-sm border border-[rgba(255,255,255,0.05)] mb-2">
                        <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold">FECHA DE REGISTRO</span>
                        <span className="text-white text-xs uppercase tracking-widest">
                          {formatDate(v.creado_en)}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-sm bg-info shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0 mt-1" />
                        <div>
                          <span className="text-text-muted text-[9px] uppercase tracking-widest block mb-0.5">ORIGEN</span>
                          <span className="text-white uppercase tracking-wider text-xs">{v.origen_direccion || 'Origen desconocido'}</span>
                        </div>
                      </div>
                      <div className="h-4 border-l border-dashed border-[rgba(255,255,255,0.2)] ml-[3px]" />
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-sm bg-primary shadow-[0_0_8px_rgba(220,38,38,0.8)] shrink-0 mt-1 animate-pulse" />
                        <div>
                          <span className="text-text-muted text-[9px] uppercase tracking-widest block mb-0.5">DESTINO</span>
                          <span className="text-white uppercase tracking-wider text-xs">{v.destino_direccion || 'Destino desconocido'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-sm bg-success" />
                      Detalles Financieros
                    </p>
                    <div className="bg-[rgba(5,150,105,0.05)] border border-[rgba(5,150,105,0.2)] p-3 rounded-sm flex justify-between items-center">
                      <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold">MONTO FINAL</span>
                      <span className="text-success text-lg font-bold whitespace-nowrap tracking-wider font-mono">
                        {formatCurrency(v.precio_final)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {viajes.length === 0 && (
          <div className="col-span-full p-8 text-center text-primary uppercase text-xs tracking-widest font-bold bg-[#141414] border border-[rgba(220,38,38,0.15)] rounded-lg">
            No hay viajes registrados
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[rgba(220,38,38,0.15)] bg-[#0A0A0A] flex justify-between items-center">
        <span className="text-text-muted text-[10px] font-bold tracking-widest uppercase">
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => updateFilters(searchValue, estadoValue, currentPage - 1)}
            disabled={currentPage <= 1}
            className="btn-secondary p-1.5 disabled:opacity-50 disabled:cursor-not-allowed border-[rgba(255,255,255,0.1)] hover:bg-[#141414]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => updateFilters(searchValue, estadoValue, currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="btn-secondary p-1.5 disabled:opacity-50 disabled:cursor-not-allowed border-[rgba(255,255,255,0.1)] hover:bg-[#141414]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
