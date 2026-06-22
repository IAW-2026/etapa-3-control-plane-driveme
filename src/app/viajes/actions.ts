'use server'

import { cancelarViaje as cancelarViajeService } from '@/lib/services/viajes'

export async function cancelarViajeAction(idViaje: string): Promise<boolean> {
  return await cancelarViajeService(idViaje)
}
