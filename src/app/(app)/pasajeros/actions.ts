'use server'
import { togglePasajero } from '@/lib/services/rider'
import { revalidatePath } from 'next/cache'

export async function togglePasajeroAction(id: string, activo: boolean) {
  const ok = await togglePasajero(id, activo)
  if (ok) revalidatePath('/pasajeros')
  return ok
}
