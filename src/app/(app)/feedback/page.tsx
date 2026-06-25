import Topbar from '@/components/Topbar'
import { getReportesPendientes, getComentariosInapropiados } from '@/lib/services/feedback'
import FeedbackClient from './FeedbackClient'

export default async function FeedbackPage() {
  let reportesError: string | null = null
  let comentariosError: string | null = null

  const [reportes, comentarios] = await Promise.all([
    getReportesPendientes().catch((e: Error) => { reportesError = e.message; return [] }),
    getComentariosInapropiados().catch((e: Error) => { comentariosError = e.message; return [] }),
  ])

  return (
    <div className="pb-12 max-w-6xl mx-auto">
      <Topbar title="Moderación · Feedback App" subtitle="Gestión de reportes y comentarios inapropiados" />
      {(reportesError || comentariosError) && (
        <div className="mb-6 p-4 bg-[rgba(220,38,38,0.1)] border border-primary/30 rounded-sm text-xs font-mono space-y-1">
          {reportesError && <p className="text-primary">Reportes: {reportesError}</p>}
          {comentariosError && <p className="text-primary">Comentarios: {comentariosError}</p>}
        </div>
      )}
      <FeedbackClient initialReportes={reportes} initialComentarios={comentarios} />
    </div>
  )
}
