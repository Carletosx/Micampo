import React from 'react';
import { FaChartArea } from 'react-icons/fa';
import SimpleLineChart from './SimpleLineChart';

const periods = [
  { key: '7D', label: '7D' },
  { key: '30D', label: '30D' },
  { key: '3M', label: '3M' },
  { key: '1A', label: '1A' },
];

const GraficoEvolucionVentas = ({ title = 'Evolución de Ventas', periodSelected = '30D', onChangePeriod, loading, data = [] }) => {
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

      <div className={`rounded-lg border border-dashed border-gray-300 ${loading ? 'bg-gray-100 animate-pulse' : 'bg-gray-100'}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          <FaChartArea className="text-gray-600" aria-hidden="true" />
          <span className="text-gray-700 text-sm">Evolución diaria de ingresos</span>
        </div>
        <div className="p-3 space-y-3">
          <div className="bg-white rounded-md border border-gray-200">
            <SimpleLineChart data={data.map(d => ({ value: d.total }))} width={600} height={180} />
          </div>
          {data.length === 0 ? (
            <div className="text-gray-600 text-sm">Sin datos en el período seleccionado</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.slice(-10).map((d, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white rounded-md border border-gray-200 px-3 py-2 text-sm">
                  <span className="text-gray-600">{d.fecha}</span>
                  <span className="text-emerald-700 font-medium">S/ {Number(d.total || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nota: preparado para integrar Recharts/Chart.js con tooltips y animaciones */}
    </div>
  );
};

export default React.memo(GraficoEvolucionVentas);
