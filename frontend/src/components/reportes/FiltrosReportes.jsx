import React from 'react';
import { FaBroom } from 'react-icons/fa';

const periodOptions = [
  { value: 'hoy', label: 'Hoy' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '7d', label: 'Últimos 7 días' },
  { value: 'mes', label: 'Este mes' },
  { value: 'mes_pasado', label: 'Mes pasado' },
  { value: '3m', label: 'Últimos 3 meses' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: 'anio', label: 'Este año' },
  { value: 'personalizado', label: 'Personalizado' },
];

const categoryOptions = [
  { value: 'todas', label: 'Todas las categorías' },
  { value: 'tuberculos', label: 'Tubérculos' },
  { value: 'verduras', label: 'Verduras' },
  { value: 'frutas', label: 'Frutas' },
  { value: 'granos', label: 'Granos' },
];

const FiltrosReportes = ({
  period,
  startDate,
  endDate,
  category,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onReset,
  onApply,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Periodo */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Periodo</label>
          <select
            value={period}
            onChange={(e) => onPeriodChange?.(e.target.value)}
            aria-label="Seleccionar período"
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {periodOptions.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Fecha Inicio */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Fecha Inicio</label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange?.(e.target.value)}
              aria-label="Fecha inicio"
              className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Fecha Fin</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange?.(e.target.value)}
              aria-label="Fecha fin"
              className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            aria-label="Seleccionar categoría"
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categoryOptions.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Acciones */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 flex items-center gap-2"
          >
            <FaBroom /> Limpiar Filtros
          </button>
          <button
            type="button"
            onClick={onApply}
            className="px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltrosReportes;
