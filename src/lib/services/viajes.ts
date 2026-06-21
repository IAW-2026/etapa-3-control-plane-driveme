const BASE_URL = process.env.DRIVER_APP_URL || 'http://localhost:3000'
const TOKEN = process.env.CONTROL_PLANE_SECRET || ''

export interface Viaje {
  id_viaje: string;
  estado_actual: string;
  precio_final: number;
  creado_en: string;
  origen_direccion: string | null;
  destino_direccion: string | null;
  conductor?: {
    id_conductor: string;
    nombre: string;
    apellido: string;
  };
  vehiculo?: {
    id_vehiculo: string;
    marca: string;
    modelo: string;
    patente: string;
  };
}

export async function getViajes(page = 1, limit = 20): Promise<{ viajes: Viaje[], total: number }> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/viajes?page=${page}&limit=${limit}`, {
      headers: {
        'x-api-key': TOKEN,
      },
      next: { revalidate: 0 } // no cache para siempre traer los más recientes
    })
    
    if (!res.ok) {
      console.error('Failed to fetch viajes', await res.text())
      return { viajes: [], total: 0 }
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch viajes', error)
    return { viajes: [], total: 0 }
  }
}

export async function cancelarViaje(id_viaje: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/viajes/${id_viaje}/cancel`, {
      method: 'PATCH',
      headers: {
        'x-api-key': TOKEN,
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) {
      console.error('Failed to cancel viaje', await res.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to cancel viaje', error)
    return false
  }
}
