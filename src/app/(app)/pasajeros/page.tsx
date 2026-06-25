import Topbar from '@/components/Topbar'
import RiderTabs from '@/components/RiderTabs'
import { getPasajeros, getRiderMetricas } from '@/lib/services/rider'
import PasajerosClient from './PasajerosClient'

export const dynamic = 'force-dynamic'

export default async function PasajerosPage(props: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const params = await props.searchParams
  const page = Number(params?.page) || 1
  const limit = 10
  const q = params?.q || ''

  const [{ pasajeros, total }, metricas] = await Promise.all([
    getPasajeros(page, limit, q || undefined),
    getRiderMetricas(),
  ])

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <Topbar title="Registro Civil" subtitle="Control de unidades pasajeras — Sector Civil" />
      <div className="mt-6">
        <RiderTabs />
        <PasajerosClient
          key={`${page}-${q}`}
          initialPasajeros={pasajeros}
          total={total}
          currentPage={page}
          totalPages={totalPages}
          currentQ={q}
          metricas={metricas}
        />
      </div>
    </div>
  )
}
