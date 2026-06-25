const BASE_URL = (process.env.RIDER_APP_URL || '').replace(/\/$/, '')
const TOKEN = process.env.CONTROL_PLANE_SECRET || ''

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Pasajero {
  id_pasajero: string
  nombre: string
  email: string
  telefono: string | null
  rating_promedio: number
  activo: boolean
  fecha_alta: string
}

export interface RiderMetricas {
  pasajeros: {
    total: number
    activos: number
    inactivos: number
    nuevosUltimos30Dias: number
    reputacionPromedio: number
  }
  solicitudes: {
    total: number
    pendientes: number
    aceptadas: number
    canceladas: number
    tasaAceptacion: number
  }
  viajes: {
    total: number
    enCurso: number
    finalizados: number
    canceladosPorConductor: number
    calificacionPromedio: number
  }
}

export interface Solicitud {
  id_solicitud: string
  pasajero: {
    id_pasajero: string
    nombre: string
    email: string
  }
  origen: { lat: number; lng: number }
  destino: { lat: number; lng: number }
  precio_estimado: number
  metodo_pago: string
  estado: string
  creada_en: string
}

// ─── M2M functions (x-api-key) ────────────────────────────────────────────────

export async function getRiderMetricas(): Promise<RiderMetricas | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/metricas`, {
      headers: { 'x-api-key': TOKEN },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getPasajeros(page = 1, limit = 10, q?: string) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (q) params.set('q', q)
    const res = await fetch(`${BASE_URL}/api/admin/pasajeros?${params}`, {
      headers: { 'x-api-key': TOKEN },
      cache: 'no-store',
    })
    if (!res.ok) return { pasajeros: [], total: 0 }
    return res.json() as Promise<{ pasajeros: Pasajero[]; total: number }>
  } catch {
    return { pasajeros: [], total: 0 }
  }
}

export async function togglePasajero(id: string, activo: boolean) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/pasajeros/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'x-api-key': TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function deletePasajero(id: string) {
  try {
    const url = `${BASE_URL}/api/admin/pasajeros/${id}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'x-api-key': TOKEN },
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`[deletePasajero] ${res.status} ${res.statusText} — url: ${url} — body: ${body}`)
    }
    return res.ok
  } catch (err) {
    console.error(`[deletePasajero] fetch error:`, err)
    return false
  }
}

export async function deleteSolicitud(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/solicitudes/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': TOKEN },
    })
    return res.ok
  } catch {
    return false
  }
}

export async function deleteViaje(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/viajes/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': TOKEN },
    })
    return res.ok
  } catch {
    return false
  }
}

export async function getSolicitudes(page = 1, limit = 10, estado?: string, q?: string) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (estado) params.set('estado', estado)
    if (q) params.set('q', q)
    const res = await fetch(`${BASE_URL}/api/admin/solicitudes?${params}`, {
      headers: { 'x-api-key': TOKEN },
      cache: 'no-store',
    })
    if (!res.ok) return { solicitudes: [], total: 0 }
    return res.json() as Promise<{ solicitudes: Solicitud[]; total: number }>
  } catch {
    return { solicitudes: [], total: 0 }
  }
}
