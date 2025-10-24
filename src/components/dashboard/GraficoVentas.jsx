import React from 'react';
import { Link } from 'react-router-dom';

const GraficoVentas = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Ventas Recientes</h3>
        <Link to="/agricultor/reportes" className="text-green-600 hover:text-green-700 text-sm font-medium">
          Ver todo
        </Link>
      </div>
      <div className="bg-gray-100 rounded-lg border border-dashed border-gray-300 h-56 flex items-center justify-center text-gray-600">
        <span role="img" aria-label="chart">📊</span>
        <span className="ml-2">Gráfico de ventas de los últimos 30 días</span>
      </div>
    </div>
  );
};

export default GraficoVentas;