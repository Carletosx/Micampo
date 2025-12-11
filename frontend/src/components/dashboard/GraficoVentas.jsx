import React from 'react';
import { Link } from 'react-router-dom';
import SimpleLineChart from '../reportes/SimpleLineChart';

const GraficoVentas = ({ data = [], loading = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Ventas Recientes</h3>
        <Link to="/agricultor/reportes" className="text-green-600 hover:text-green-700 text-sm font-medium">
          Ver todo
        </Link>
      </div>
      <div className={`rounded-lg border border-dashed border-gray-300 ${loading?'bg-gray-100 animate-pulse':'bg-gray-100'}`} style={{ minHeight: 224 }}>
        <div className="p-3">
          {data && data.length > 0 ? (
            <SimpleLineChart data={data.map(d=>({ value: d.total }))} width={600} height={180} />
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-600">
              <span role="img" aria-label="chart">📊</span>
              <span className="ml-2">Sin datos en el período</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraficoVentas;
