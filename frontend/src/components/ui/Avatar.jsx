import React from 'react'

const Avatar = ({ name = '', src, size = 28 }) => {
  const initial = (name || '').trim().charAt(0).toUpperCase() || 'U'
  const s = { width: size, height: size }
  return (
    <div className="rounded-full bg-green-600 text-white flex items-center justify-center overflow-hidden" style={s}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-semibold">{initial}</span>
      )}
    </div>
  )
}

export default Avatar
