'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Conductor, toggleVehiculoStatus } from '@/lib/services/driver'
import ToggleStatusButton from './ToggleStatusButton'
import VehiculosModal from './VehiculosModal'
import { Search, ChevronLeft, ChevronRight, ExternalLink, CarFront } from 'lucide-react'

export default function ConductoresClient({ initialConductores, total, currentPage, currentSearch, currentEstado }: { initialConductores: Conductor[], total: number, currentPage: number, currentSearch: string, currentEstado: string }) {
  const [conductores, setConductores] = useState<Conductor[]>(initialConductores)
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null)
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [estadoValue, setEstadoValue] = useState(currentEstado)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setConductores(initialConductores)
  }, [initialConductores])

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
    <div className="card-brutalist overflow-hidden flex flex-col">
      <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="section-label text-xs m-0">
          Lista de Conductores ({total})
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
              placeholder="Buscar por nombre, ID..."
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
            <option value="activo">ACTIVOS</option>
            <option value="inactivo">BLOQUEADOS</option>
            <option value="DISPONIBLE">DISPONIBLES</option>
            <option value="OCUPADO">OCUPADOS</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[radial-gradient(circle_at_top_center,rgba(220,38,38,0.08),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(153,27,27,0.05),transparent_40%),#050505]">
        {conductores.map((c) => {
          const shortId = c.id_conductor.split('_')[1] || c.id_conductor;
          const displayId = shortId.length > 10 ? `${shortId.slice(0, 5)}...${shortId.slice(-4)}` : shortId;
          return (
            <div key={c.id_conductor} className="bg-[rgba(20,20,20,0.8)] backdrop-blur-md border border-[rgba(220,38,38,0.15)] rounded-lg p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:border-[rgba(220,38,38,0.4)] hover:shadow-[0_0_15px_rgba(220,38,38,0.1)] transition-all">

              <div className="flex justify-between items-start border-b border-[rgba(255,255,255,0.05)] pb-3">
                <div>
                  <h3 className="text-white text-sm font-bold tracking-widest uppercase truncate max-w-[150px] sm:max-w-[180px]">{c.nombre} {c.apellido}</h3>
                  <span className="text-text-muted text-[10px] font-mono uppercase tracking-widest mt-1 block">ID: {displayId}</span>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`font-bold tracking-widest uppercase text-[9px] flex items-center gap-1.5 px-2 py-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded ${c.estado === 'DISPONIBLE' || c.estado === 'ONLINE' ? 'text-success' : c.estado === 'OCUPADO' ? 'text-warning' : 'text-text-muted'}`}>
                    <span className={`w-1.5 h-1.5 rounded-sm ${c.estado === 'DISPONIBLE' || c.estado === 'ONLINE' ? 'bg-success shadow-[0_0_8px_rgba(5,150,105,0.8)]' : c.estado === 'OCUPADO' ? 'bg-warning shadow-[0_0_8px_rgba(217,119,6,0.8)] animate-pulse' : 'bg-text-muted'}`} />
                    {c.estado}
                  </span>

                  {c.isActive ? (
                    <span className="text-emerald-400 bg-[rgba(5,150,105,0.1)] border border-[rgba(5,150,105,0.3)] px-2 py-1 rounded text-[9px] font-bold tracking-widest uppercase inline-block">CUENTA ACTIVA</span>
                  ) : (
                    <span className="text-red-400 bg-[rgba(220,38,38,0.1)] border border-[rgba(220,38,38,0.3)] px-2 py-1 rounded text-[9px] font-bold tracking-widest uppercase inline-block">BLOQUEADA</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setSelectedConductor(c)}
                  className="bg-transparent border border-[rgba(156,163,175,0.3)] text-white hover:border-[#DC2626] rounded px-3 py-1.5 text-[10px] whitespace-nowrap font-bold tracking-widest flex items-center gap-2 transition-colors"
                >
                  <CarFront size={14} /> AUTOS ({c.vehiculos?.length || 0})
                </button>

                <ToggleStatusButton idConductor={c.id_conductor} currentStatus={c.isActive} onToggle={handleToggle} />
              </div>
            </div>
          )
        })}
        {conductores.length === 0 && (
          <div className="col-span-full p-8 text-center text-primary uppercase text-xs tracking-widest font-bold bg-[#141414] border border-[rgba(220,38,38,0.15)] rounded-lg">
            No hay conductores registrados
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
