'use client'

import { useState } from 'react'
import { togglePasajeroAction } from './actions'

export default function TogglePasajeroButton({ idPasajero, currentStatus, onToggle }: { idPasajero: string, currentStatus: boolean, onToggle: (id: string, s: boolean) => void }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const success = await togglePasajeroAction(idPasajero, !currentStatus)
      if (success) {
        onToggle(idPasajero, !currentStatus)
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
      className={`btn-secondary px-3 py-1.5 text-[10px] whitespace-nowrap font-bold tracking-widest disabled:opacity-50 disabled:cursor-wait ${
        currentStatus 
          ? 'border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary' 
          : 'border-success/50 text-success hover:bg-[rgba(5,150,105,0.1)] hover:border-success'
      }`}
    >
      {loading ? '...' : currentStatus ? 'DESACTIVAR' : 'ACTIVAR'}
    </button>
  )
}
