import React from 'react';

const STATUS_KEYS = {
  todos: 'Todos',
  en_proceso: 'En Proceso',
  en_camino: 'En Camino',
  entregados: 'Entregados',
  cancelados: 'Cancelados'
};

const TabButton = ({ active, label, count = 0, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm border ${
      active ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'
    } hover:bg-green-50 transition-colors`}
  >
    <span className="mr-2">{label}</span>
    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold ${
      active ? 'bg-white text-green-700' : 'bg-gray-100 text-gray-700'
    }`}>{count}</span>
  </button>
);

const TabsEstadoPedidos = ({ active = 'todos', counts = {}, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 bg-white p-3 rounded-md shadow-sm mb-4">
      {Object.keys(STATUS_KEYS).map((key) => (
        <TabButton
          key={key}
          label={STATUS_KEYS[key]}
          count={counts[key] || 0}
          active={active === key}
          onClick={() => onChange?.(key)}
        />
      ))}
    </div>
  );
};

export default TabsEstadoPedidos;