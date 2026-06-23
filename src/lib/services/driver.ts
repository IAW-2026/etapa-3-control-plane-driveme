const BASE_URL = (process.env.DRIVER_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
const TOKEN = process.env.CONTROL_PLANE_SECRET || ''

export interface Vehiculo {
  id_vehiculo: string;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  isActive: boolean;
  color: string;
}

export interface Conductor {
  id_conductor: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: string;
  isActive: boolean;
  calificacion_promedio: number;
  fecha_alta: string;
  vehiculos: Vehiculo[];
}

export async function getConductores(page = 1, limit = 20): Promise<{ conductores: Conductor[], total: number }> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/conductores?page=${page}&limit=${limit}`, {
      headers: { 'x-api-key': TOKEN, 'Content-Type': 'application/json' },
      cache: 'no-store'
    })
    if (!res.ok) {
        console.error(`Error: ${res.status}`);
        return { conductores: [], total: 0 }
    }
    const data = await res.json()
    return { conductores: data.conductores, total: data.total }
  } catch (error) {
    console.error('Failed to fetch conductores', error)
    return { conductores: [], total: 0 }
  }
}

export async function toggleConductorStatus(id: string, isActive: boolean): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/conductores/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'x-api-key': TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive })
    })
    return res.ok
  } catch (error) {
    console.error('Failed to toggle status', error)
    return false
  }
}

export async function toggleVehiculoStatus(id: string, isActive: boolean): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/vehiculos/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'x-api-key': TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive })
    })
    return res.ok
  } catch (error) {
    console.error('Failed to toggle vehiculo status', error)
    return false
  }
}
