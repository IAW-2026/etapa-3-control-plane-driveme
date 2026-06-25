'use server'
import { deleteSolicitud } from '@/lib/services/rider'
import { revalidatePath } from 'next/cache'

export async function deleteSolicitudAction(id: string) {
  const ok = await deleteSolicitud(id)
  if (ok) revalidatePath('/solicitudes')
  return ok
}
