import React from 'react'

const parseAmount = (v) => {
  if (typeof v === 'number') return v
  const s = String(v || '').replace(/[^0-9.,]/g, '').replace(/\./g, '').replace(/,/g, '.')
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

const SimpleDonutChart = ({ data = [], size = 160, thickness = 24 }) => {
  const values = data.map(d => parseAmount(d.value))
  const total = values.reduce((a, b) => a + b, 0) || 1
  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness) / 2
  const circumference = 2 * Math.PI * r
  let offset = 0
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={thickness} />
      {data.map((d, i) => {
        const val = values[i]
        const frac = val / total
        const len = circumference * frac
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={d.color || '#16a34a'}
            strokeWidth={thickness}
            strokeDasharray={`${len} ${circumference - len}`}
            strokeDashoffset={-offset}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        )
        offset += len
        return el
      })}
    </svg>
  )
}

export default React.memo(SimpleDonutChart)
