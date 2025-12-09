import React from 'react'

export default function Tabs({ items = [], active, onChange }) {
  return (
    <div className="flex border-b bg-white">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange?.(it.key)}
          className={`px-6 py-3 font-medium text-sm rounded-t-md ${active === it.key ? 'text-green-700 bg-green-50 border-b-2 border-green-600' : 'text-gray-600 bg-white hover:bg-gray-50'}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}
