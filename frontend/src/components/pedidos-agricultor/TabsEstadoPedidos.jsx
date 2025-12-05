import React from 'react';

const tabsDef = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes', emoji: '📋' },
  { key: 'en_proceso', label: 'En Proceso', emoji: '⚙️' },
  { key: 'enviado', label: 'Enviados', emoji: '📦' },
  { key: 'entregado', label: 'Entregados', emoji: '✅' },
  { key: 'cancelado', label: 'Cancelados', emoji: '❌' }
];

const TabsEstadoPedidos = ({ active = 'todos', counts = {}, onChange }) => {
  const base = 'px-4 py-2 rounded-full text-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500';
  const activeClass = 'bg-green-600 text-white border-green-600 shadow-sm';
  const inactiveClass = 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100';

  return (
    <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Filtrar por estado del pedido">
      {tabsDef.map(t => {
        const isActive = active === t.key;
        const count = counts?.[t.key] ?? 0;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${t.key}`}
            className={`${base} ${isActive ? activeClass : inactiveClass}`}
            onClick={() => onChange?.(t.key)}
          >
            <span className="mr-1">{t.emoji || ''}</span>
            {t.label}
            <span className={`ml-2 text-xs ${isActive ? 'text-white bg-white/10' : 'text-gray-500 bg-gray-100'} rounded-full px-2 py-0.5`}>{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabsEstadoPedidos;