'use client'

import { Vehiculo, Conductor } from '@/lib/services/driver'
import { useState } from 'react'
import { X } from 'lucide-react'

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
    <div className="fixed inset-0 bg-[#050505]/90 backdrop-blur-md flex justify-center items-center z-[1000]">
      <div className="card-brutalist bg-[#0A0A0A] p-6 w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white text-base m-0 tracking-widest uppercase font-bold">
            Vehículos de {conductor.nombre} {conductor.apellido}
          </h2>
          <button onClick={onClose} className="text-primary hover:text-primary-hover transition-colors">
            <X size={20} />
          </button>
        </div>

        {!conductor.vehiculos || conductor.vehiculos.length === 0 ? (
          <p className="text-text-muted text-xs uppercase tracking-widest font-bold text-center">Este conductor no tiene vehículos registrados.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {conductor.vehiculos.map(v => (
              <div key={v.id_vehiculo} className={`border rounded-sm p-4 flex justify-between items-center transition-colors ${
                v.isActive 
                  ? 'border-[rgba(220,38,38,0.15)] bg-[#141414]' 
                  : 'border-primary/50 bg-[rgba(220,38,38,0.05)]'
              }`}>
                <div>
                  <div className="text-text-primary text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                    {v.marca} {v.modelo} ({v.anio})
                    {!v.isActive && (
                      <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(220,38,38,0.5)]">BLOQUEADO</span>
                    )}
                  </div>
                  <div className="text-text-muted text-[10px] tracking-widest uppercase mt-1.5">PATENTE: {v.patente} <span className="mx-2 text-[rgba(220,38,38,0.5)]">|</span> COLOR: {v.color}</div>
                </div>
                <button
                  onClick={() => handleToggle(v)}
                  disabled={loadingIds.includes(v.id_vehiculo)}
                  className={`btn-secondary px-3 py-1.5 text-[10px] whitespace-nowrap font-bold tracking-widest disabled:opacity-50 disabled:cursor-wait ${
                    v.isActive 
                      ? 'border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary' 
                      : 'border-success/50 text-success hover:bg-[rgba(5,150,105,0.1)] hover:border-success'
                  }`}
                >
                  {loadingIds.includes(v.id_vehiculo) ? '...' : (v.isActive ? 'BLOQUEAR' : 'HABILITAR')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
