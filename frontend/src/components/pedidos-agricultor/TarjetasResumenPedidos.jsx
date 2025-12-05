import React from 'react';
import { FaClipboardList, FaCog, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const accentMap = {
  pending: {
    container: 'border-gray-100',
    icon: 'bg-amber-50 text-amber-600 border border-amber-100',
    value: 'text-amber-700'
  },
  process: {
    container: 'border-gray-100',
    icon: 'bg-blue-50 text-blue-600 border border-blue-100',
    value: 'text-blue-700'
  },
  done: {
    container: 'border-gray-100',
    icon: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    value: 'text-emerald-700'
  },
  income: {
    container: 'border-gray-100',
    icon: 'bg-teal-50 text-teal-600 border border-teal-100',
    value: 'text-teal-700'
  },
};

const StatCard = ({ label, value, icon: Icon, accent = 'done' }) => {
  const a = accentMap[accent] || accentMap.done;
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border ${a.container} hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${a.icon}`}>
          <Icon />
        </div>
        <div>
          <div className="text-xs text-gray-500">{label}</div>
          <div className={`text-2xl font-extrabold ${a.value}`}>{value}</div>
        </div>
      </div>
    </div>
  );
};

const TarjetasResumenPedidos = ({
  stats = {
    pendientes: 8,
    enProceso: 12,
    completadosMes: 45,
    ingresosMes: 'S/ 8,450'
  }
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <StatCard label="Pedidos Pendientes" value={stats.pendientes} icon={FaClipboardList} accent="pending" />
      <StatCard label="En Proceso" value={stats.enProceso} icon={FaCog} accent="process" />
      <StatCard label="Completados Este Mes" value={stats.completadosMes} icon={FaCheckCircle} accent="done" />
      <StatCard label="Ingresos del Mes" value={stats.ingresosMes} icon={FaMoneyBillWave} accent="income" />
    </div>
  );
};

export default TarjetasResumenPedidos;