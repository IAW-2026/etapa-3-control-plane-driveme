'use client'

import { useState } from 'react'
import { toggleAction } from './actions'
import { Ban, CheckCircle } from 'lucide-react'

export default function ToggleStatusButton({ idConductor, currentStatus, onToggle }: { idConductor: string, currentStatus: boolean, onToggle: (id: string, s: boolean) => void }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const success = await toggleAction(idConductor, !currentStatus)
      if (success) {
        onToggle(idConductor, !currentStatus)
      } else {
        alert("Error al actualizar estado")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={currentStatus ? "Banear Conductor" : "Desbanear Conductor"}
      aria-label={currentStatus ? "Banear Conductor" : "Desbanear Conductor"}
      className={`btn-secondary p-1.5 flex items-center justify-center mx-auto text-[10px] whitespace-nowrap font-bold tracking-widest disabled:opacity-50 disabled:cursor-wait ${
        currentStatus 
          ? 'border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary' 
          : 'border-success/50 text-success hover:bg-[rgba(5,150,105,0.1)] hover:border-success'
      }`}
    >
      {loading ? '...' : currentStatus ? <Ban size={16} /> : <CheckCircle size={16} />}
    </button>
  )
}
