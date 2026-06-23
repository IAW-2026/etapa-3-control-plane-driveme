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

  return (
    <div className="card-brutalist overflow-hidden">
      <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A]">
        <h2 className="section-label text-xs">
          Lista de Conductores ({total})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(220,38,38,0.15)] bg-[rgba(20,20,20,0.5)]">
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">ID Conductor</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">Nombre</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">Estado Operativo</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Cuenta</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Bloqueo</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-right">Vehículos</th>
            </tr>
          </thead>
          <tbody>
            {conductores.map((c) => {
              const shortId = c.id_conductor.split('_')[1] || c.id_conductor;
              const displayId = shortId.length > 10 ? `${shortId.slice(0, 5)}...${shortId.slice(-4)}` : shortId;
              return (
              <tr key={c.id_conductor} className="border-b border-[rgba(220,38,38,0.08)] hover:bg-[#141414] transition-colors">
                <td className="p-3 text-text-primary text-xs font-mono uppercase font-bold tracking-widest text-left align-middle">
                  {displayId}
                </td>
                <td className="p-3 text-white text-xs font-bold tracking-widest uppercase whitespace-nowrap text-left align-middle">{c.nombre} {c.apellido}</td>
                <td className="p-3 text-xs whitespace-nowrap text-left align-middle">
                  <span className={`font-bold tracking-widest uppercase text-[10px] flex items-center gap-2 ${c.estado === 'DISPONIBLE' || c.estado === 'ONLINE' ? 'text-success' : c.estado === 'OCUPADO' ? 'text-warning' : 'text-text-muted'}`}>
                    <span className={`w-1.5 h-1.5 rounded-sm ${c.estado === 'DISPONIBLE' || c.estado === 'ONLINE' ? 'bg-success shadow-[0_0_8px_rgba(5,150,105,0.8)]' : c.estado === 'OCUPADO' ? 'bg-warning shadow-[0_0_8px_rgba(217,119,6,0.8)] animate-pulse' : 'bg-text-muted'}`} />
                    {c.estado}
                  </span>
                </td>
                <td className="p-3 text-xs whitespace-nowrap text-center align-middle">
                  {c.isActive ? (
                    <span className="text-success bg-[rgba(5,150,105,0.1)] border border-[rgba(5,150,105,0.3)] px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase inline-block">ACTIVA</span>
                  ) : (
                    <span className="text-primary bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase inline-block">BLOQUEADA</span>
                  )}
                </td>
                <td className="p-3 text-center align-middle">
                  <ToggleStatusButton idConductor={c.id_conductor} currentStatus={c.isActive} onToggle={handleToggle} />
                </td>
                <td className="p-3 text-right align-middle">
                  <button
                    onClick={() => setSelectedConductor(c)}
                    className="btn-secondary border-info/50 text-info hover:bg-[rgba(59,130,246,0.1)] hover:border-info px-3 py-1.5 text-[10px] whitespace-nowrap font-bold tracking-widest inline-flex items-center justify-center"
                  >
                    VER AUTOS ({c.vehiculos?.length || 0})
                  </button>
                </td>
              </tr>
            )})}
            {conductores.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-primary uppercase text-xs tracking-widest font-bold">No hay conductores registrados</td>
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
