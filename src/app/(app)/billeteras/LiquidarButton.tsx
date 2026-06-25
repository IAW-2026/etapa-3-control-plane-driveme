'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { liquidar } from './actions'
import { formatCurrency } from '@/lib/format'

export function LiquidarButton({ idConductor }: { idConductor: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; monto?: number; error?: string } | null>(null)

  function handleClick() {
    startTransition(async () => {
      const res = await liquidar(idConductor)
      setResult(res)
      if (res.ok) router.refresh()
    })
  }

  if (result?.ok) {
    return (
      <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase bg-success/10 px-2 py-1 rounded-sm border border-success/30">
        +{formatCurrency(result.monto ?? 0)} LIQUIDADO
      </span>
    )
  }

  if (result?.error) {
    return (
      <span className="text-primary text-[10px] font-bold tracking-widest uppercase bg-primary/10 px-2 py-1 rounded-sm border border-primary/30">{result.error}</span>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="btn-secondary border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] px-3 py-1.5 text-[10px] whitespace-nowrap font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'LIQUIDANDO...' : 'LIQUIDAR'}
    </button>
  )
}
