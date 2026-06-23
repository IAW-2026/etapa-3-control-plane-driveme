const BASE_URL = (process.env.RIDER_APP_URL || '').replace(/\/$/, '')
const TOKEN = process.env.RIDER_SERVICE_SECRET || ''

export interface Pasajero {
  id_pasajero: string
  nombre: string
  email: string
  telefono: string | null
  rating_promedio: number
  activo: boolean
  fecha_alta: string
}

export async function getPasajeros(page = 1, limit = 20) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/pasajeros?page=${page}&limit=${limit}`,
      { headers: { 'x-api-key': TOKEN }, cache: 'no-store' }
    )
    if (!res.ok) return { pasajeros: [], total: 0 }
    return res.json() as Promise<{ pasajeros: Pasajero[]; total: number }>
  } catch (error) {
    console.error('Failed to fetch pasajeros', error)
    return { pasajeros: [], total: 0 }
  }
}

export async function togglePasajero(id: string, activo: boolean) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/pasajeros/${id}/toggle`,
      {
        method: 'PATCH',
        headers: { 'x-api-key': TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo }),
      }
    )
    return res.ok
  } catch (error) {
    console.error('Failed to toggle pasajero status', error)
    return false
  }
}
