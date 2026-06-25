'use server'

import { toggleConductorStatus } from '@/lib/services/driver'

export async function toggleAction(id: string, newStatus: boolean) {
  return await toggleConductorStatus(id, newStatus)
}
