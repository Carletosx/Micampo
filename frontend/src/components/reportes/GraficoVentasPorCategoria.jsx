import React from 'react';
import { FaChartPie } from 'react-icons/fa';
import SimpleDonutChart from './SimpleDonutChart';

const LegendItem = ({ label, value, color }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm`} style={{ backgroundColor: color }} />
      <span className="text-gray-700">{label}</span>
    </div>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

const GraficoVentasPorCategoria = ({ title = 'Ventas por Categoría', data = [], loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className={`rounded-lg border border-dashed border-gray-300 flex items-center justify-center ${loading ? 'bg-gray-100 animate-pulse' : 'bg-gray-100'}`} style={{ minHeight: 192 }}>
          {loading ? (
            <>
              <FaChartPie className="text-gray-600 mr-2" aria-hidden="true" />
              <span className="text-gray-700 text-sm">Cargando…</span>
            </>
          ) : (
            <SimpleDonutChart data={data} size={180} thickness={26} />
          )}
        </div>
        <div className="md:col-span-2 space-y-2">
          {data.map((d, idx) => (
            <LegendItem key={idx} label={d.label} value={d.value} color={d.color} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(GraficoVentasPorCategoria);
