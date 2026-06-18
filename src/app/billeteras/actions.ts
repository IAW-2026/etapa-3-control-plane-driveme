'use server'

import { liquidarConductor } from '@/lib/services/payments'

export interface LiquidacionResult {
  ok: boolean
  monto?: number
  error?: string
}

export async function liquidar(idConductor: string): Promise<LiquidacionResult> {
  try {
    const data = await liquidarConductor(idConductor)
    return { ok: true, monto: data.monto_pagado }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' }
  }
}
