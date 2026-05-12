interface ROI {
  total: number
  holiday: number
  hoursSaved: number
  revLow: number
  revHigh: number
}

export default function ROIWidget({ roi }: { roi: ROI }) {
  const tiles = [
    { val: roi.total,     label: 'Menus Managed',         accent: false, green: false },
    { val: roi.holiday,   label: 'Holiday Schedules',      accent: false, green: false },
    { val: `${roi.hoursSaved}h`, label: 'Est. Hours Saved / mo', accent: true,  green: false },
    {
      val: `$${roi.revLow.toLocaleString()}–$${roi.revHigh.toLocaleString()}`,
      label: 'Est. Holiday Revenue Lift',
      accent: false, green: true,
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14,
      marginBottom: 28,
    }}>
      {tiles.map(({ val, label, accent, green }) => (
        <div key={label} style={{
          background: 'var(--sv-surface)',
          border: `1px solid ${accent ? 'var(--sv-accent-border)' : green ? 'rgba(74,222,128,0.25)' : 'var(--sv-border)'}`,
          borderRadius: 'var(--sv-radius)',
          padding: '18px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: accent ? 'var(--sv-accent)' : green ? 'var(--sv-success)' : 'var(--sv-border)',
          }} />
          <div style={{
            fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 4,
            color: accent ? 'var(--sv-accent)' : green ? 'var(--sv-success)' : 'var(--sv-text)',
          }}>
            {val}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--sv-muted)',
          }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
