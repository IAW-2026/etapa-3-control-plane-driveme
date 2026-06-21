import Topbar from '@/components/Topbar'
import { getConductores } from '@/lib/services/driver'
import ConductoresClient from './ConductoresClient'

export default async function ConductoresPage(props: { searchParams: Promise<{ page?: string }> }) {
  const params = await props.searchParams
  const page = Number(params?.page) || 1
  const limit = 20

  const { conductores, total } = await getConductores(page, limit)

  return (
    <div style={{ padding: '0 0 48px' }}>
      <Topbar title="Gestión de Conductores" subtitle="Administración de cuentas y estados" />
      <div style={{ padding: '0 32px', marginTop: '24px' }}>
        <ConductoresClient initialConductores={conductores} total={total} currentPage={page} />
      </div>
    </div>
  )
}
