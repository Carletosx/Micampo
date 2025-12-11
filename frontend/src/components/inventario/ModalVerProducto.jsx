import React from 'react'
import { API_ORIGIN } from '../../api/config.js'

const resolveImage = (p) => {
  const im = p?.imagenUrl || p?.imagen_url || p?.imagen || ''
  if (!im) return ''
  if (im.startsWith('/uploads/')) return `${API_ORIGIN}${im}`
  return im
}

export default function ModalVerProducto({ isOpen, producto, onClose }) {
  if (!isOpen || !producto) return null
  const imgSrc = resolveImage(producto)
  const precio = producto.precio || producto.precioUnitario || 0
  const unidad = producto.unidad || 'kg'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Detalle del Producto</h3>
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded border bg-gray-100 overflow-hidden">
            {imgSrc ? (<img src={imgSrc} alt={producto.nombre} className="w-full h-full object-cover" />) : null}
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600">{producto.categoria}</div>
            <div className="text-base font-semibold text-gray-900">{producto.nombre}</div>
            <div className="text-sm text-gray-700">Precio: S/ {Number(precio).toFixed(2)} / {unidad}</div>
            <div className="text-sm text-gray-700">Stock actual: {Number(producto.stockActual ?? producto.stock ?? 0)} {unidad}</div>
            <div className="text-sm text-gray-700">Stock mínimo: {Number(producto.stockMinimo ?? producto.stockMin ?? 0)}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-600">Descripción</div>
          <div className="text-sm text-gray-800">{producto.descripcion || '—'}</div>
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cerrar</button>
        </div>
      </div>
    </div>
  )
}
