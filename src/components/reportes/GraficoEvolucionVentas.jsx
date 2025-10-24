import React from 'react';
import { FaChartArea } from 'react-icons/fa';

const periods = [
  { key: '7D', label: '7D' },
  { key: '30D', label: '30D' },
  { key: '3M', label: '3M' },
  { key: '1A', label: '1A' },
];

const GraficoEvolucionVentas = ({ title = 'Evolución de Ventas', periodSelected = '30D', onChangePeriod, loading }) => {
  const base = 'px-3 py-1.5 rounded-full text-xs border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500';
  const activeClass = 'bg-green-600 text-white border-green-600 shadow-sm';
  const inactiveClass = 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100';

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base md:text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2" role="tablist" aria-label="Periodo del gráfico">
          {periods.map(p => (
            <button
              key={p.key}
              role="tab"
              aria-selected={periodSelected === p.key}
              className={`${base} ${periodSelected === p.key ? activeClass : inactiveClass}`}
              onClick={() => onChangePeriod?.(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Área de gráfico - placeholder con skeleton opcional */}
      <div className={`rounded-lg border border-dashed border-gray-300 h-60 flex items-center justify-center ${loading ? 'bg-gray-100 animate-pulse' : 'bg-gray-100'}`}>
        <FaChartArea className="text-gray-600 mr-2" aria-hidden="true" />
        <span className="text-gray-700 text-sm">Gráfico de evolución de ventas en el período seleccionado</span>
      </div>

      {/* Nota: preparado para integrar Recharts/Chart.js con tooltips y animaciones */}
    </div>
  );
};

export default React.memo(GraficoEvolucionVentas);