import React from 'react';
import { FaSearch, FaSortAmountDown, FaCalendarAlt } from 'react-icons/fa';

const FiltroPedidos = ({
  searchTerm = '',
  onSearchChange,
  dateRange = '30', // '30' | '180' | '365' | 'all'
  onDateRangeChange,
  sortOrder = 'desc', // 'desc' | 'asc'
  onSortOrderChange
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        {/* Buscador */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Buscar por número de pedido o producto..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Rango de fecha */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange?.(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            aria-label="Rango de fecha"
          >
            <option value="30">Últimos 30 días</option>
            <option value="180">Últimos 6 meses</option>
            <option value="365">Último año</option>
            <option value="all">Todo</option>
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="flex items-center gap-2">
          <FaSortAmountDown className="text-gray-500" />
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange?.(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            aria-label="Orden"
          >
            <option value="desc">Ordenar por Más recientes</option>
            <option value="asc">Ordenar por Más antiguos</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltroPedidos;