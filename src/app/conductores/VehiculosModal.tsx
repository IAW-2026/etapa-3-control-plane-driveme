'use client'

import { Vehiculo, Conductor } from '@/lib/services/driver'
import { useState } from 'react'

interface VehiculosModalProps {
  conductor: Conductor;
  onClose: () => void;
  onToggleVehiculo: (vehiculoId: string, isActive: boolean) => Promise<void>;
}

export default function VehiculosModal({ conductor, onClose, onToggleVehiculo }: VehiculosModalProps) {
  const [loadingIds, setLoadingIds] = useState<string[]>([])

  const handleToggle = async (v: Vehiculo) => {
    setLoadingIds(prev => [...prev, v.id_vehiculo])
    await onToggleVehiculo(v.id_vehiculo, !v.isActive)
    setLoadingIds(prev => prev.filter(id => id !== v.id_vehiculo))
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(51, 65, 85, 0.8)',
        borderRadius: '12px',
        padding: '24px',
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>
            Vehículos de {conductor.nombre} {conductor.apellido}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px'
          }}>✕</button>
        </div>

        {!conductor.vehiculos || conductor.vehiculos.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>Este conductor no tiene vehículos registrados.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {conductor.vehiculos.map(v => (
              <div key={v.id_vehiculo} style={{
                border: `1px solid ${v.isActive ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 113, 113, 0.3)'}`,
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: v.isActive ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 113, 113, 0.05)'
              }}>
                <div>
                  <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {v.marca} {v.modelo} ({v.anio})
                    {!v.isActive && (
                      <span style={{ backgroundColor: '#f87171', color: 'white', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Bloqueado</span>
                    )}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Patente: {v.patente} | Color: {v.color}</div>
                </div>
                <button
                  onClick={() => handleToggle(v)}
                  disabled={loadingIds.includes(v.id_vehiculo)}
                  style={{
                    backgroundColor: v.isActive ? 'rgba(248, 113, 113, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                    color: v.isActive ? '#f87171' : '#34d399',
                    border: `1px solid ${v.isActive ? 'rgba(248, 113, 113, 0.2)' : 'rgba(52, 211, 153, 0.2)'}`,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: loadingIds.includes(v.id_vehiculo) ? 'not-allowed' : 'pointer',
                    opacity: loadingIds.includes(v.id_vehiculo) ? 0.7 : 1,
                  }}
                >
                  {loadingIds.includes(v.id_vehiculo) ? '...' : (v.isActive ? 'Bloquear' : 'Habilitar')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
