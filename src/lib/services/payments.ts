const BASE_URL = (process.env.PAYMENTS_APP_URL ?? 'https://proyecto-a-payments-driveme.vercel.app').replace(/\/$/, '')

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.CONTROL_PLANE_SECRET}`,
    'Content-Type': 'application/json',
  }
}

async function fetchOrThrow<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export interface BancoCentral {
  fondosEmpresa: number
  fondosADebitar: number
  fondosDebitadosHistorico: number
  fechaActualizacion: string
}

export interface Billetera {
  id: string
  idConductor: string
  montoPendiente: number
  montoLiquidado: number
  fechaActualizacion: string
}

export interface Transaccion {
  id: string
  idViaje: string
  idPasajero: string
  idConductor: string
  metodoPago: 'EFECTIVO' | 'MERCADO_PAGO'
  monto: string
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO'
  estadoLiquidacion: 'PENDIENTE' | 'LIQUIDADO'
  gatewayProvider: string | null
  gatewayTransactionId: string | null
  detalleGateway: string | null
  fechaCreacion: string
  fechaActualizacion: string
}

export interface User {
  id: string
  rol: 'RIDER' | 'DRIVER' | 'ADMIN'
}

export const getBancoCentral = () =>
  fetchOrThrow<BancoCentral>('/api/pagos/admin/banco-central')

export const getBilleteras = () =>
  fetchOrThrow<Billetera[]>('/api/pagos/admin/billeteras')

export const getTransacciones = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetchOrThrow<Transaccion[]>(`/api/pagos/transacciones${qs ? `?${qs}` : ''}`)
}

export const getUsers = () =>
  fetchOrThrow<User[]>('/api/pagos/admin/users')

export interface Liquidacion {
  id_liquidacion: string
  monto_pagado: number
  estado: string
}

export async function liquidarConductor(idConductor: string): Promise<Liquidacion> {
  const res = await fetch(`${BASE_URL}/api/pagos/liquidaciones`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: JSON.stringify({ id_conductor: idConductor }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<Liquidacion>
}
