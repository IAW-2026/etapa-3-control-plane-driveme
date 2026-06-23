'use client'

import { useState } from 'react'
import { Pasajero } from '@/lib/services/rider'
import TogglePasajeroButton from './TogglePasajeroButton'

export default function PasajerosClient({ initialPasajeros, total, currentPage }: { initialPasajeros: Pasajero[], total: number, currentPage: number }) {
  const [pasajeros, setPasajeros] = useState<Pasajero[]>(initialPasajeros)

  const handleToggle = (id: string, newStatus: boolean) => {
    setPasajeros(prev => prev.map(p => p.id_pasajero === id ? { ...p, activo: newStatus } : p))
  }

  return (
    <div className="card-brutalist overflow-hidden">
      <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A]">
        <h2 className="section-label text-xs">
          Lista de Pasajeros ({total})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(220,38,38,0.15)] bg-[rgba(20,20,20,0.5)]">
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">ID Pasajero</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">Nombre</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-left">Email / Teléfono</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Rating</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Cuenta</th>
              <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Bloqueo</th>
            </tr>
          </thead>
          <tbody>
            {pasajeros.map((p) => {
              const shortId = p.id_pasajero.split('_')[1] || p.id_pasajero;
              const displayId = shortId.length > 10 ? `${shortId.slice(0, 5)}...${shortId.slice(-4)}` : shortId;
              return (
              <tr key={p.id_pasajero} className="border-b border-[rgba(220,38,38,0.08)] hover:bg-[#141414] transition-colors">
                <td className="p-3 text-text-primary text-xs font-mono uppercase font-bold tracking-widest text-left align-middle">
                  {displayId}
                </td>
                <td className="p-3 text-white text-xs font-bold tracking-widest uppercase whitespace-nowrap text-left align-middle">{p.nombre}</td>
                <td className="p-3 text-xs whitespace-nowrap text-left align-middle text-text-muted">
                  {p.email} <br/> {p.telefono || '-'}
                </td>
                <td className="p-3 text-xs whitespace-nowrap text-center align-middle font-bold text-white">
                  {p.rating_promedio != null && !isNaN(Number(p.rating_promedio)) ? Number(p.rating_promedio).toFixed(1) : '-'} ★
                </td>
                <td className="p-3 text-xs whitespace-nowrap text-center align-middle">
                  {p.activo ? (
                    <span className="text-success bg-[rgba(5,150,105,0.1)] border border-[rgba(5,150,105,0.3)] px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase inline-block">ACTIVA</span>
                  ) : (
                    <span className="text-primary bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase inline-block">BLOQUEADA</span>
                  )}
                </td>
                <td className="p-3 text-center align-middle">
                  <TogglePasajeroButton idPasajero={p.id_pasajero} currentStatus={p.activo} onToggle={handleToggle} />
                </td>
              </tr>
            )})}
            {pasajeros.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-primary uppercase text-xs tracking-widest font-bold">No hay pasajeros registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
