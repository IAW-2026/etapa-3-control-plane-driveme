'use client'

import { useState } from 'react'
import type { Reporte, ComentarioInapropiado } from '@/lib/services/feedback'
import { resolverReporteAction, moderarComentarioAction } from './actions'

const MOTIVO_LABEL: Record<string, string> = {
  COMENTARIO_INAPROPIADO: 'Comentario inapropiado',
  CONDUCTA_INAPROPIADA: 'Conducta inapropiada',
  FRAUDE: 'Fraude',
  SPAM: 'Spam',
}

function formatDate(s: string) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(s))
  } catch {
    return s
  }
}

export default function FeedbackClient({
  initialReportes,
  initialComentarios,
}: {
  initialReportes: Reporte[]
  initialComentarios: ComentarioInapropiado[]
}) {
  const [reportes, setReportes] = useState<Reporte[]>(initialReportes)
  const [comentarios, setComentarios] = useState<ComentarioInapropiado[]>(initialComentarios)
  const [loadingReporteId, setLoadingReporteId] = useState<string | null>(null)
  const [loadingComentarioId, setLoadingComentarioId] = useState<string | null>(null)

  const handleReporte = async (id: string, decision: 'APROBADO' | 'RECHAZADO') => {
    setLoadingReporteId(id)
    const success = await resolverReporteAction(id, decision)
    if (success) {
      setReportes(prev => prev.filter(r => r.id_reporte !== id))
    } else {
      alert('Error al resolver el reporte')
    }
    setLoadingReporteId(null)
  }

  const handleComentario = async (id: string, decision: 'APROBAR' | 'ELIMINAR') => {
    setLoadingComentarioId(id)
    const success = await moderarComentarioAction(id, decision)
    if (success) {
      setComentarios(prev => prev.filter(c => c.id_calificacion !== id))
    } else {
      alert('Error al moderar el comentario')
    }
    setLoadingComentarioId(null)
  }

  return (
    <div className="space-y-8">
      {/* Reportes pendientes */}
      <div className="card-brutalist overflow-hidden">
        <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A]">
          <h2 className="section-label text-xs">
            Reportes pendientes ({reportes.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(220,38,38,0.15)] bg-[rgba(20,20,20,0.5)]">
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Motivo</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Descripción</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Reportante</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Reportado</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Fecha</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map(r => (
                <tr key={r.id_reporte} className="border-b border-[rgba(220,38,38,0.08)] hover:bg-[#141414] transition-colors">
                  <td className="p-3 text-white text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                    {MOTIVO_LABEL[r.motivo] ?? r.motivo}
                  </td>
                  <td className="p-3 text-text-muted text-xs max-w-xs truncate">
                    {r.descripcion}
                  </td>
                  <td className="p-3 text-text-primary text-xs font-mono tracking-widest">
                    {r.id_reportante}
                  </td>
                  <td className="p-3 text-text-primary text-xs font-mono tracking-widest">
                    {r.id_reportado}
                  </td>
                  <td className="p-3 text-text-muted text-xs whitespace-nowrap">
                    {formatDate(r.fecha)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleReporte(r.id_reporte, 'APROBADO')}
                        disabled={loadingReporteId === r.id_reporte}
                        className="btn-secondary border-success/50 text-success hover:bg-[rgba(5,150,105,0.1)] hover:border-success px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingReporteId === r.id_reporte ? '...' : 'APROBAR'}
                      </button>
                      <button
                        onClick={() => handleReporte(r.id_reporte, 'RECHAZADO')}
                        disabled={loadingReporteId === r.id_reporte}
                        className="btn-secondary border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingReporteId === r.id_reporte ? '...' : 'RECHAZAR'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reportes.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-primary uppercase text-xs tracking-widest font-bold">
                    Sin reportes pendientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comentarios marcados por IA */}
      <div className="card-brutalist overflow-hidden">
        <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A]">
          <h2 className="section-label text-xs">
            Comentarios marcados por IA ({comentarios.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(220,38,38,0.15)] bg-[rgba(20,20,20,0.5)]">
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Comentario</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Emisor</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Receptor</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest text-center">Puntaje</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">Fecha</th>
                <th className="p-3 text-text-muted text-[10px] font-bold uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map(c => (
                <tr key={c.id_calificacion} className="border-b border-[rgba(220,38,38,0.08)] hover:bg-[#141414] transition-colors">
                  <td className="p-3 text-white text-xs max-w-xs">
                    <span className="line-clamp-2">{c.comentario}</span>
                  </td>
                  <td className="p-3 text-text-primary text-xs font-mono tracking-widest">
                    {c.id_emisor}
                  </td>
                  <td className="p-3 text-text-primary text-xs font-mono tracking-widest">
                    {c.id_receptor}
                  </td>
                  <td className="p-3 text-center text-warning font-bold font-mono text-xs">
                    {c.puntaje}/5
                  </td>
                  <td className="p-3 text-text-muted text-xs whitespace-nowrap">
                    {formatDate(c.fecha)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleComentario(c.id_calificacion, 'APROBAR')}
                        disabled={loadingComentarioId === c.id_calificacion}
                        className="btn-secondary border-success/50 text-success hover:bg-[rgba(5,150,105,0.1)] hover:border-success px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingComentarioId === c.id_calificacion ? '...' : 'APROBAR'}
                      </button>
                      <button
                        onClick={() => handleComentario(c.id_calificacion, 'ELIMINAR')}
                        disabled={loadingComentarioId === c.id_calificacion}
                        className="btn-secondary border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingComentarioId === c.id_calificacion ? '...' : 'ELIMINAR'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {comentarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-primary uppercase text-xs tracking-widest font-bold">
                    Sin comentarios marcados por IA
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
