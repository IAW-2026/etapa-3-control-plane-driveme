'use client'

import { Viaje, cancelarViaje } from '@/lib/services/viajes'
import { useState } from 'react'

export default function ViajesClient({ initialViajes, total, currentPage }: { initialViajes: Viaje[], total: number, currentPage: number }) {
  const [viajes, setViajes] = useState<Viaje[]>(initialViajes)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const card = {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' }
      case 'EN_CURSO': return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' }
      case 'CANCELADO': 
      case 'CANCELADO_POR_CONDUCTOR': return { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' }
      default: return { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' } // ACEPTADO
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
    const success = await cancelarViaje(id)
    if (success) {
      setViajes(prev => prev.map(v => v.id_viaje === id ? { ...v, estado_actual: 'CANCELADO_POR_CONDUCTOR' } : v))
    } else {
      alert('Error al cancelar el viaje')
    }
    setLoadingId(null)
  }

  return (
    <div style={card}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <h2 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          LISTA DE VIAJES ({total})
        </h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
              <th style={{ width: '10%', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>ID Viaje</th>
              <th style={{ width: '15%', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Fecha</th>
              <th style={{ width: '20%', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Conductor</th>
              <th style={{ width: '25%', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Ruta</th>
              <th style={{ width: '10%', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Monto</th>
              <th style={{ width: '10%', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Estado</th>
              <th style={{ width: '10%', padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {viajes.map((v) => {
              const displayId = v.id_viaje.length > 8 ? `${v.id_viaje.slice(0, 8)}...` : v.id_viaje;
              const sColor = getStatusColor(v.estado_actual);
              return (
              <tr key={v.id_viaje} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace', verticalAlign: 'middle' }}>
                  {displayId}
                </td>
                <td style={{ padding: '12px 16px', color: '#f8fafc', fontSize: '13px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  {formatDate(v.creado_en)}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  {v.conductor ? (
                    <span style={{ color: '#f8fafc' }}>{v.conductor.nombre} {v.conductor.apellido}</span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Sin conductor</span>
                  )}
                  {v.vehiculo && (
                    <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>{v.vehiculo.patente}</div>
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', verticalAlign: 'middle', maxWidth: '300px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60a5fa', flexShrink: 0 }} />
                      <span style={{ color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.origen_direccion || 'Origen desconocido'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#f87171', flexShrink: 0 }} />
                      <span style={{ color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.destino_direccion || 'Destino desconocido'}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#f8fafc', fontSize: '14px', fontWeight: 600, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  {formatCurrency(v.precio_final)}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  <span style={{ color: sColor.color, backgroundColor: sColor.bg, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {v.estado_actual}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                  {(v.estado_actual === 'EN_CURSO' || v.estado_actual === 'ACEPTADO') && (
                    <button
                      onClick={() => handleCancel(v.id_viaje)}
                      disabled={loadingId === v.id_viaje}
                      style={{
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        color: '#f87171',
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: loadingId === v.id_viaje ? 'wait' : 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseOver={(e) => { if (loadingId !== v.id_viaje) e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.2)' }}
                      onMouseOut={(e) => { if (loadingId !== v.id_viaje) e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)' }}
                    >
                      {loadingId === v.id_viaje ? 'Cancelando...' : 'Forzar Cancelación'}
                    </button>
                  )}
                </td>
              </tr>
            )})}
            {viajes.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No hay viajes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
