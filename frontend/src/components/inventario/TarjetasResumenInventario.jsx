import React from 'react';
import { FaBoxOpen, FaExclamationTriangle, FaTimesCircle, FaCoins } from 'react-icons/fa';

const Card = ({ icon, value, label, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-xl font-semibold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

const TarjetasResumenInventario = ({
  productos = 45,
  stockBajo = 8,
  stockCritico = 3,
  valorTotal = 24580,
}) => {
  const formatCurrency = (v) => `S/ ${v.toLocaleString('es-PE')}`;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={<FaBoxOpen />}
        value={productos}
        label="Productos en Inventario"
        color="bg-green-600"
      />
      <Card
        icon={<FaExclamationTriangle />}
        value={stockBajo}
        label="Stock Bajo"
        color="bg-yellow-500"
      />
      <Card
        icon={<FaTimesCircle />}
        value={stockCritico}
        label="Stock Crítico"
        color="bg-red-600"
      />
      <Card
        icon={<FaCoins />}
        value={formatCurrency(valorTotal)}
        label="Valor Total Inventario"
        color="bg-blue-600"
      />
    </div>
  );
};

export default TarjetasResumenInventario;