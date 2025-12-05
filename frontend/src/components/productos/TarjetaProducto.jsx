import React from 'react';
import { API_ORIGIN } from '../../api/config.js';

function Badge({ children, color = 'bg-gray-100 text-gray-700' }) {
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${color}`}>{children}</span>
  );
}

export default function TarjetaProducto({ producto, onEditar, onPausar, onEliminar, onActivar, onDetalles }) {
  const {
    nombre,
    categoria,
    estado = 'activo',
    descripcion,
    precio = 0,
    unidad = 'kg',
    stock = 0,
    stockMin = 0,
    imagenUrl,
  } = producto;

  const activo = estado === 'activo';
  const stockBajo = stock <= stockMin && stockMin > 0;

  const formatoPrecio = (v) => `S/ ${Number(v).toFixed(2)}/${unidad}`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative h-40 bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
        <div className="h-28 w-28 rounded-md bg-white/90 shadow border border-white overflow-hidden">
          {imagenUrl ? (
            <img src={imagenUrl.startsWith('/uploads/') ? `${API_ORIGIN}${imagenUrl}` : imagenUrl} alt={nombre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-green-300/40" />
          )}
        </div>
        <div className="absolute top-2 left-2">
          <Badge color="bg-white/90 text-gray-700 border border-gray-200">Stock: {stock} {unidad}</Badge>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <Badge color={activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
            {activo ? 'Activo' : 'Inactivo'}
          </Badge>
          {stockBajo && (
            <Badge color="bg-yellow-100 text-yellow-700">Stock Bajo</Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs font-semibold text-green-700">{categoria?.toUpperCase()}</div>
        <h3 className="text-lg font-bold text-gray-800">{nombre}</h3>
        {descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2">{descripcion}</p>
        )}

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-green-700 font-bold text-xl">{formatoPrecio(precio)}</div>
            <div className="text-xs text-gray-500">{stock} {unidad} disponibles</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <button
            onClick={() => onEditar?.(producto)}
            className="text-sm bg-green-100 hover:bg-green-200 text-green-700 font-medium px-3 py-2 rounded"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onDetalles?.(producto)}
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-2 rounded"
          >
            📄 Detalles
          </button>

          {activo ? (
            <button
              onClick={() => onPausar?.(producto)}
              className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium px-3 py-2 rounded"
            >
              ⏸️ Pausar
            </button>
          ) : (
            <button
              onClick={() => onActivar?.(producto)}
              className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-2 rounded"
            >
              ▶️ Activar
            </button>
          )}

          <button
            onClick={() => onEliminar?.(producto)}
            className="text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium px-3 py-2 rounded"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
