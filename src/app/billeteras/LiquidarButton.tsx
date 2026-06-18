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
      <span className="text-emerald-400 text-xs font-mono">
        +{formatCurrency(result.monto ?? 0)} liquidado
      </span>
    )
  }

  if (result?.error) {
    return (
      <span className="text-red-400 text-xs">{result.error}</span>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="px-3 py-1 rounded text-xs font-medium bg-violet-500/15 text-violet-400 border border-violet-500/25 hover:bg-violet-500/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Liquidando…' : 'Liquidar'}
    </button>
  )
}
