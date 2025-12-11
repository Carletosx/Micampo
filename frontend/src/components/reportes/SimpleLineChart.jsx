import React from 'react'

const SimpleLineChart = ({ data = [], width = 600, height = 200, stroke = '#16a34a', bg = '#ffffff' }) => {
  const n = data.length
  const w = width
  const h = height
  const maxV = data.reduce((m, d) => Math.max(m, Number(d.value || d.total || 0)), 0) || 1
  const points = data.map((d, i) => {
    const x = n > 1 ? (i * (w - 2) / (n - 1)) + 1 : w / 2
    const v = Number(d.value || d.total || 0)
    const y = h - 1 - (v / maxV) * (h - 2)
    return `${x},${y}`
  })
  const path = points.length ? `M ${points[0]} L ${points.slice(1).join(' ')}` : ''
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ backgroundColor: bg }}>
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={points.join(' ')} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  )
}

export default React.memo(SimpleLineChart)
