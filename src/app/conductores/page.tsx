import Topbar from '@/components/Topbar'
import { getConductores } from '@/lib/services/driver'
import ConductoresClient from './ConductoresClient'

export default async function ConductoresPage(props: { searchParams: Promise<{ page?: string }> }) {
  const params = await props.searchParams
  const page = Number(params?.page) || 1
  const limit = 20

  const { conductores, total } = await getConductores(page, limit)

  return (
    <div className="pb-12 max-w-6xl mx-auto">
      <Topbar title="Gestión de Conductores" subtitle="Administración de cuentas y estados" />
      <div className="mt-6">
        <ConductoresClient initialConductores={conductores} total={total} currentPage={page} />
      </div>
    </div>
  )
}
