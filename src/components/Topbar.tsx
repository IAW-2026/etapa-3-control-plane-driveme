interface TopbarProps {
  title: string
  subtitle: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-7 border-b border-[rgba(220,38,38,0.15)]">
      <div className="min-w-0">
        <h1 className="text-white text-lg md:text-xl font-bold uppercase tracking-[0.15em] m-0 leading-tight">
          {title}
        </h1>
        <p className="text-primary text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1.5 opacity-80 leading-relaxed">
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2.5 text-primary-hover text-xs font-bold uppercase tracking-widest shrink-0">
        <span className="w-2 h-2 rounded-sm bg-primary shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse" />
        LIVE
      </div>
    </div>
  )
}
