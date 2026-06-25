'use server'

import { resolverReporte, moderarComentario } from '@/lib/services/feedback'

export async function resolverReporteAction(
  id: string,
  decision: 'APROBADO' | 'RECHAZADO'
): Promise<boolean> {
  try {
    await resolverReporte(id, decision)
    return true
  } catch {
    return false
  }
}

export async function moderarComentarioAction(
  id: string,
  decision: 'APROBAR' | 'ELIMINAR'
): Promise<boolean> {
  try {
    await moderarComentario(id, decision)
    return true
  } catch {
    return false
  }
}
