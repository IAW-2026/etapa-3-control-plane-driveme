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

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function StarRating({ puntaje }: { puntaje: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={`text-sm ${i <= puntaje ? 'text-warning' : 'text-white/15'}`}>★</span>
        ))}
      </div>
      <span className="text-text-muted text-[10px]">{puntaje} de 5</span>
    </div>
  )
}

function formatDate(s: string) {
  try {
    const d = new Date(s)
    const dia = String(d.getDate()).padStart(2, '0')
    const mes = MESES[d.getMonth()]
    const hora = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${dia}-${mes}, ${hora}:${min}`
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
        <div className="divide-y divide-[rgba(220,38,38,0.08)]">
          {reportes.map(r => (
            <div key={r.id_reporte} className="p-4 hover:bg-[#141414] transition-colors space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  {MOTIVO_LABEL[r.motivo] ?? r.motivo}
                </span>
                <span className="text-text-muted text-xs whitespace-nowrap">
                  {formatDate(r.fecha)}
                </span>
              </div>
              {r.descripcion && (
                <p className="text-text-muted text-xs leading-relaxed">{r.descripcion}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-text-muted text-[10px] uppercase tracking-widest mb-0.5">Reportante</p>
                  <p className="text-text-primary text-xs font-mono break-all">{r.id_reportante}</p>
                </div>
                <div>
                  <p className="text-text-muted text-[10px] uppercase tracking-widest mb-0.5">Reportado</p>
                  <p className="text-text-primary text-xs font-mono break-all">{r.id_reportado}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleReporte(r.id_reporte, 'APROBADO')}
                  disabled={loadingReporteId === r.id_reporte}
                  className="btn-secondary border-success/50 text-success hover:bg-[rgba(5,150,105,0.1)] hover:border-success px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingReporteId === r.id_reporte ? '...' : 'ELIMINAR CALIFICACIÓN'}
                </button>
                <button
                  onClick={() => handleReporte(r.id_reporte, 'RECHAZADO')}
                  disabled={loadingReporteId === r.id_reporte}
                  className="btn-secondary border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingReporteId === r.id_reporte ? '...' : 'MANTENER'}
                </button>
              </div>
            </div>
          ))}
          {reportes.length === 0 && (
            <p className="p-8 text-center text-primary uppercase text-xs tracking-widest font-bold">
              Sin reportes pendientes
            </p>
          )}
        </div>
      </div>

      {/* Comentarios marcados por IA */}
      <div className="card-brutalist overflow-hidden">
        <div className="p-5 border-b border-[rgba(220,38,38,0.15)] bg-[#0A0A0A]">
          <h2 className="section-label text-xs">
            Comentarios marcados por IA ({comentarios.length})
          </h2>
        </div>
        <div className="divide-y divide-[rgba(220,38,38,0.08)]">
          {comentarios.map(c => (
            <div key={c.id_calificacion} className="p-4 hover:bg-[#141414] transition-colors space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <StarRating puntaje={c.puntaje} />
                <span className="text-text-muted text-xs whitespace-nowrap">
                  {formatDate(c.fecha)}
                </span>
              </div>
              <p className="text-white text-xs leading-relaxed">{c.comentario}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-text-muted text-[10px] uppercase tracking-widest mb-0.5">Emisor</p>
                  <p className="text-text-primary text-xs font-mono break-all">{c.id_emisor}</p>
                </div>
                <div>
                  <p className="text-text-muted text-[10px] uppercase tracking-widest mb-0.5">Receptor</p>
                  <p className="text-text-primary text-xs font-mono break-all">{c.id_receptor}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleComentario(c.id_calificacion, 'APROBAR')}
                  disabled={loadingComentarioId === c.id_calificacion}
                  className="btn-secondary border-success/50 text-success hover:bg-[rgba(5,150,105,0.1)] hover:border-success px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingComentarioId === c.id_calificacion ? '...' : 'ELIMINAR CALIFICACIÓN'}
                </button>
                <button
                  onClick={() => handleComentario(c.id_calificacion, 'ELIMINAR')}
                  disabled={loadingComentarioId === c.id_calificacion}
                  className="btn-secondary border-primary/50 text-primary hover:bg-[rgba(220,38,38,0.1)] hover:border-primary px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingComentarioId === c.id_calificacion ? '...' : 'MANTENER'}
                </button>
              </div>
            </div>
          ))}
          {comentarios.length === 0 && (
            <p className="p-8 text-center text-primary uppercase text-xs tracking-widest font-bold">
              Sin comentarios marcados por IA
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
