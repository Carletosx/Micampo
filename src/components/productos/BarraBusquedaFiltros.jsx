import React from 'react';

export default function BarraBusquedaFiltros({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categoriasOptions = [],
  onNuevoProducto,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar productos por nombre..."
            className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="todas">Todas las categorías</option>
            {categoriasOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="stock_bajo">Stock Bajo</option>
          </select>
        </div>
      </div>
      <div className="md:ml-auto">
        <button
          onClick={onNuevoProducto}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + Nuevo Producto
        </button>
      </div>
    </div>
  );
}