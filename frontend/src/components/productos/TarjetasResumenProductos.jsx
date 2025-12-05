import React from 'react';
import { FaBoxOpen, FaCheckCircle, FaExclamationTriangle, FaPauseCircle } from 'react-icons/fa';

function Card({ title, value, icon: Icon, color = 'text-gray-600', bg = 'bg-white' }) {
  return (
    <div className={`flex items-center gap-3 ${bg} border border-gray-200 rounded-md p-4 shadow-sm`}> 
      <div className={`p-2 rounded-md ${color.replace('text', 'bg')}`}> 
        <Icon className={`text-white`} />
      </div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-lg font-semibold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

export default function TarjetasResumenProductos({ total, activos, stockBajo, inactivos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card title="Total Productos" value={total} icon={FaBoxOpen} color="text-green-600" />
      <Card title="Productos Activos" value={activos} icon={FaCheckCircle} color="text-blue-600" />
      <Card title="Stock Bajo" value={stockBajo} icon={FaExclamationTriangle} color="text-yellow-600" />
      <Card title="Inactivos" value={inactivos} icon={FaPauseCircle} color="text-gray-500" />
    </div>
  );
}