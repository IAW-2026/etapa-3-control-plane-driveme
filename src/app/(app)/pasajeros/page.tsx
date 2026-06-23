import Topbar from '@/components/Topbar'
import { getPasajeros } from '@/lib/services/rider'
import PasajerosClient from './PasajerosClient'

export default async function PasajerosPage(props: { searchParams: Promise<{ page?: string }> }) {
  const params = await props.searchParams
  const page = Number(params?.page) || 1
  const limit = 20

  const { pasajeros, total } = await getPasajeros(page, limit)

  return (
    <div className="pb-12 max-w-6xl mx-auto">
      <Topbar title="Gestión de Pasajeros" subtitle="Administración de cuentas y estados" />
      <div className="mt-6">
        <PasajerosClient initialPasajeros={pasajeros} total={total} currentPage={page} />
      </div>
    </div>
  )
}
