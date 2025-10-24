import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const periods = [
  { value: '30dias', label: 'Últimos 30 días' },
  { value: 'hoy', label: 'Hoy' },
  { value: 'semana', label: 'Esta semana' },
  { value: 'mes', label: 'Este mes' },
  { value: 'personalizado', label: 'Personalizado' },
];

const amounts = [
  { value: 'todos', label: 'Todos los montos' },
  { value: 'lt50', label: 'Menos de S/50' },
  { value: '50-100', label: 'S/50-S/100' },
  { value: '100-500', label: 'S/100-S/500' },
  { value: 'gt500', label: 'Más de S/500' },
];

const BarraBusquedaFiltrosPedidos = ({
  query, onQueryChange,
  period = '30dias', onPeriodChange,
  amount = 'todos', onAmountChange,
  onReset,
}) => {
  const handleReset = () => {
    onQueryChange?.('');
    onPeriodChange?.('30dias');
    onAmountChange?.('todos');
    onReset?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Input de búsqueda con icono */}
        <div className="flex items-center">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
              placeholder="Buscar por número de pedido o cliente..."
              aria-label="Buscar pedidos"
              className="w-full pl-9 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {query && (
              <button
                type="button"
                onClick={handleReset}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Filtro de período */}
        <div>
          <select
            value={period}
            onChange={(e) => onPeriodChange?.(e.target.value)}
            aria-label="Filtrar por período"
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {periods.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Filtro de monto */}
        <div>
          <select
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            aria-label="Filtrar por monto"
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {amounts.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón limpiar todo */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default BarraBusquedaFiltrosPedidos;