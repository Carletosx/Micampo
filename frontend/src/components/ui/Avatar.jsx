import React from 'react'

const Avatar = ({ name = '', size = 28 }) => {
  const initial = (name || '').trim().charAt(0).toUpperCase() || 'U'
  const s = { width: size, height: size }
  return (
    <div className="rounded-full bg-green-600 text-white flex items-center justify-center" style={s}>
      <span className="text-sm font-semibold">{initial}</span>
    </div>
  )
}

export default Avatar
