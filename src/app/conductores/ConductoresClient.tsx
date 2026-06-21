'use client'

import { useState } from 'react'
import { Conductor, toggleVehiculoStatus } from '@/lib/services/driver'
import ToggleStatusButton from './ToggleStatusButton'
import VehiculosModal from './VehiculosModal'

export default function ConductoresClient({ initialConductores, total, currentPage }: { initialConductores: Conductor[], total: number, currentPage: number }) {
  const [conductores, setConductores] = useState<Conductor[]>(initialConductores)
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null)

  const handleToggle = (id: string, newStatus: boolean) => {
    setConductores(prev => prev.map(c => c.id_conductor === id ? { ...c, isActive: newStatus } : c))
  }

  const handleToggleVehiculo = async (vehiculoId: string, isActive: boolean) => {
    const success = await toggleVehiculoStatus(vehiculoId, isActive)
    if (success) {
      setConductores(prev => prev.map(c => {
        if (!c.vehiculos) return c
        return {
          ...c,
          vehiculos: c.vehiculos.map(v => v.id_vehiculo === vehiculoId ? { ...v, isActive } : v)
        }
      }))
      setSelectedConductor(prev => {
        if (!prev || !prev.vehiculos) return prev
        return {
          ...prev,
          vehiculos: prev.vehiculos.map(v => v.id_vehiculo === vehiculoId ? { ...v, isActive } : v)
        }
      })
    }
  }

  const card = {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(51, 65, 85, 0.5)',
    borderRadius: '8px',
    padding: '20px',
    backdropFilter: 'blur(4px)',
  }

  return (
    <div style={card}>
      <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Lista de Conductores ({total})
      </h2>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>ID Conductor</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Nombre</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Estado Operativo</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>Cuenta</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {conductores.map((c) => {
              const shortId = c.id_conductor.split('_')[1] || c.id_conductor;
              const displayId = shortId.length > 10 ? `${shortId.slice(0, 5)}...${shortId.slice(-4)}` : shortId;
              return (
              <tr key={c.id_conductor} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace', verticalAlign: 'middle' }}>
                  {displayId}
                </td>
                <td style={{ padding: '12px 16px', color: '#f8fafc', fontSize: '14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{c.nombre} {c.apellido}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  <span style={{ color: c.estado === 'DISPONIBLE' || c.estado === 'ONLINE' ? '#34d399' : c.estado === 'OCUPADO' ? '#fbbf24' : '#94a3b8' }}>
                    ● {c.estado}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  {c.isActive ? (
                    <span style={{ color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>ACTIVA</span>
                  ) : (
                    <span style={{ color: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>BLOQUEADA</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <ToggleStatusButton idConductor={c.id_conductor} currentStatus={c.isActive} onToggle={handleToggle} />
                    <button
                      onClick={() => setSelectedConductor(c)}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#60a5fa',
                        border: '1px solid rgba(96, 165, 250, 0.3)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Ver Autos ({c.vehiculos?.length || 0})
                    </button>
                  </div>
                </td>
              </tr>
            )})}
            {conductores.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No hay conductores registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedConductor && (
        <VehiculosModal 
          conductor={selectedConductor} 
          onClose={() => setSelectedConductor(null)} 
          onToggleVehiculo={handleToggleVehiculo}
        />
      )}
    </div>
  )
}
