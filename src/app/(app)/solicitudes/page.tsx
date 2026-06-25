import Topbar from '@/components/Topbar'
import RiderTabs from '@/components/RiderTabs'
import { getSolicitudes } from '@/lib/services/rider'
import SolicitudesClient from './SolicitudesClient'

export const dynamic = 'force-dynamic'

const ESTADOS = ['PENDIENTE_PAGO', 'BUSCANDO_CONDUCTOR', 'ACEPTADA', 'CANCELADA_POR_PASAJERO', 'EXPIRADA_SIN_ACEPTACION', 'PAGO_RECHAZADO']

export default async function SolicitudesPage(props: {
  searchParams: Promise<{ page?: string; estado?: string; q?: string }>
}) {
  const params = await props.searchParams
  const page = Number(params?.page) || 1
  const limit = 10
  const estado = ESTADOS.includes(params?.estado ?? '') ? params.estado : undefined
  const q = params?.q || ''

  const { solicitudes, total } = await getSolicitudes(page, limit, estado, q || undefined)
  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <Topbar title="Registro Civil" subtitle="Solicitudes de pasajeros — Sector Civil" />
      <div className="mt-6">
        <RiderTabs />
        <SolicitudesClient
          key={`${page}-${estado ?? ''}-${q}`}
          initialSolicitudes={solicitudes}
          total={total}
          currentPage={page}
          totalPages={totalPages}
          currentEstado={estado ?? ''}
          currentQ={q}
        />
      </div>
    </div>
  )
}
