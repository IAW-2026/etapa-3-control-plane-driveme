const BASE_URL = (process.env.FEEDBACK_APP_URL ?? 'https://proyecto-a-feedback-driveme.vercel.app').replace(/\/$/, '')

function authHeaders(): HeadersInit {
  return {
    'x-api-key': process.env.CONTROL_PLANE_SECRET ?? '',
    'Content-Type': 'application/json',
  }
}

async function fetchOrThrow<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export interface Reporte {
  id_reporte: string
  id_calificacion: string
  id_reportante: string
  id_reportado: string
  motivo: string
  descripcion: string
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
  fecha: string
}

export interface ComentarioInapropiado {
  id_calificacion: string
  id_viaje: string
  id_emisor: string
  id_receptor: string
  puntaje: number
  comentario: string
  fecha: string
}

export const getReportesPendientes = () =>
  fetchOrThrow<Reporte[]>('/api/admin/reportes')

export const getComentariosInapropiados = () =>
  fetchOrThrow<ComentarioInapropiado[]>('/api/admin/comentarios')

export async function resolverReporte(
  id: string,
  decision: 'APROBADO' | 'RECHAZADO'
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/reportes/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ decision }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function moderarComentario(
  id: string,
  decision: 'APROBAR' | 'ELIMINAR'
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/comentarios/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ decision }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}
