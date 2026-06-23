import Topbar from '@/components/Topbar'
import { getReportesPendientes, getComentariosInapropiados } from '@/lib/services/feedback'
import FeedbackClient from './FeedbackClient'

export default async function FeedbackPage() {
  const [reportes, comentarios] = await Promise.all([
    getReportesPendientes().catch(() => []),
    getComentariosInapropiados().catch(() => []),
  ])

  return (
    <div className="pb-12 max-w-6xl mx-auto">
      <Topbar title="Moderación · Feedback App" subtitle="Gestión de reportes y comentarios inapropiados" />
      <FeedbackClient initialReportes={reportes} initialComentarios={comentarios} />
    </div>
  )
}
