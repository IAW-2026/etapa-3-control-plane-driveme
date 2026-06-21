'use client'

import { useState } from 'react'
import { toggleAction } from './actions'

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
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: currentStatus ? 'rgba(248, 113, 113, 0.1)' : 'rgba(52, 211, 153, 0.1)',
        color: currentStatus ? '#f87171' : '#34d399',
        border: `1px solid ${currentStatus ? 'rgba(248, 113, 113, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`,
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.2s',
        width: '105px',
        textAlign: 'center',
      }}
    >
      {loading ? '...' : currentStatus ? 'Bloquear' : 'Desbloquear'}
    </button>
  )
}
