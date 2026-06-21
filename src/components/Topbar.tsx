interface TopbarProps {
  title: string
  subtitle: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px 20px',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
        marginBottom: '28px',
      }}
    >
      <div>
        <h1
          style={{
            color: '#e2e8f0',
            fontSize: '20px',
            fontWeight: 600,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0', letterSpacing: '0.01em' }}>
          {subtitle}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#a78bfa',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#a78bfa',
            boxShadow: '0 0 6px rgba(167, 139, 250, 0.6)',
            animation: 'pulse 2s infinite',
          }}
        />
        Live
      </div>
    </div>
  )
}
