'use client'

interface Props {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, description, confirmLabel = 'CONFIRMAR', onConfirm, onCancel }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur backdrop */}
      <div
        className="absolute inset-0 bg-[#050505]/50 backdrop-blur-lg"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative z-10 card-brutalist w-full max-w-sm mx-4 p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="section-label text-sm">{title}</h3>
          <p className="text-text-muted text-xs tracking-wider leading-relaxed">{description}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary py-2 text-[10px] font-bold tracking-widest uppercase"
          >
            CANCELAR
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-[10px] font-bold tracking-widest uppercase rounded-sm border border-primary bg-[rgba(220,38,38,0.12)] text-primary hover:bg-[rgba(220,38,38,0.2)] transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
