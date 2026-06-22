'use client'

import { Viaje } from '@/lib/services/viajes'
import { cancelarViajeAction } from './actions'
import { useState, Fragment } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function ViajesClient({ initialViajes, total, currentPage }: { initialViajes: Viaje[], total: number, currentPage: number }) {
  const [viajes, setViajes] = useState<Viaje[]>(initialViajes)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'text-success bg-[rgba(5,150,105,0.1)] border border-success/30'
      case 'EN_CURSO': return 'text-warning bg-[rgba(217,119,6,0.1)] border border-warning/30 animate-pulse'
      case 'CANCELADO': 
      case 'CANCELADO_POR_CONDUCTOR': return 'text-primary bg-[rgba(220,38,38,0.1)] border border-primary/30'
      default: return 'text-info bg-[rgba(59,130,246,0.1)] border border-info/30' // ACEPTADO
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
    <div className="card-brutalist overflow-hidden">
      <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A]">
        <h2 className="section-label text-xs">
          LISTA DE VIAJES ({total})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(220,38,38,0.15)] bg-[rgba(20,20,20,0.5)]">
              <th className="w-[15%] p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">ID Viaje</th>
              <th className="w-[30%] p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">Conductor</th>
              <th className="w-[15%] p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Estado</th>
              <th className="w-[15%] p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Detalles</th>
              <th className="w-[25%] p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {viajes.map((v) => {
              const displayId = v.id_viaje.length > 8 ? `${v.id_viaje.slice(0, 8)}...` : v.id_viaje;
              const sClasses = getStatusClasses(v.estado_actual);
              const isExpanded = expandedIds.has(v.id_viaje);
              const displayStatus = v.estado_actual.replace(/_/g, ' ');

              return (
                <Fragment key={v.id_viaje}>
                  <tr className={`border-b border-[rgba(220,38,38,0.08)] hover:bg-[#141414] transition-colors ${isExpanded ? 'bg-[#141414]' : ''}`}>
                    <td className="p-3 text-text-primary text-xs font-mono uppercase font-bold tracking-widest text-left align-middle">
                      {displayId}
                    </td>
                    <td className="p-3 text-sm whitespace-nowrap text-left align-middle">
                      {v.conductor ? (
                        <span className="text-white font-bold tracking-widest uppercase text-xs">{v.conductor.nombre} {v.conductor.apellido}</span>
                      ) : (
                        <span className="text-text-muted italic uppercase text-xs tracking-widest">Sin conductor</span>
                      )}
                      {v.vehiculo && (
                        <div className="text-text-muted text-[10px] uppercase tracking-widest mt-0.5">{v.vehiculo.patente}</div>
                      )}
                    </td>
                    <td className="p-3 text-xs whitespace-nowrap text-center align-middle">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm inline-block ${sClasses}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center align-middle">
                      <button
                        onClick={() => toggleExpand(v.id_viaje)}
                        className="btn-secondary border-info/50 text-info hover:bg-[rgba(59,130,246,0.1)] px-3 py-1.5 text-[10px] whitespace-nowrap font-bold inline-flex items-center justify-center gap-1 mx-auto"
                      >
                        {isExpanded ? (
                          <><ChevronUp size={12} /> OCULTAR</>
                        ) : (
                          <><ChevronDown size={12} /> VER MÁS</>
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      {(v.estado_actual === 'EN_CURSO' || v.estado_actual === 'ACEPTADO') && (
                        <button
                          onClick={() => handleCancel(v.id_viaje)}
                          disabled={loadingId === v.id_viaje}
                          className="btn-secondary border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] px-3 py-1.5 text-[10px] whitespace-nowrap font-bold"
                        >
                          {loadingId === v.id_viaje ? 'CANCELANDO...' : 'CANCELAR VIAJE'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-[#0A0A0A] border-b border-[rgba(220,38,38,0.15)]">
                      <td colSpan={5} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#141414] p-4 rounded-sm border border-[rgba(255,255,255,0.05)]">
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
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
            {viajes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-primary uppercase text-xs tracking-widest font-bold">No hay viajes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
