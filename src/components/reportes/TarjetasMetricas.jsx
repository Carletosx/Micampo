import React from 'react';
import { FaMoneyBillWave, FaShoppingCart, FaBoxOpen, FaChartLine } from 'react-icons/fa';

const Badge = ({ text, type = 'up' }) => {
  const cls = type === 'up'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{text}</span>
  );
};

const StatCard = ({ label, value, icon: Icon, accentClass, hint, hintType }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accentClass}`}>
          <Icon />
        </div>
        <div>
          <div className="text-xs text-gray-500">{label}</div>
          <div className={`text-2xl font-extrabold text-gray-800`}>{value}</div>
          {hint && <div className="mt-1"><Badge text={hint} type={hintType} /></div>}
        </div>
      </div>
    </div>
  );
};

const TarjetasMetricas = ({
  metrics = {
    ingresosTotales: 'S/ 8,450',
    pedidosCompletados: 128,
    productosVendidos: 23,
    ticketPromedio: 'S/ 66',
    compIngresos: '↑ 12.5% vs período anterior',
    compPedidos: '↑ 18% vs período anterior',
    compProductos: '↑ 5 productos vs período anterior',
    compTicket: '↓ 3.2% vs período anterior'
  }
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <StatCard label="Ingresos Totales" value={metrics.ingresosTotales} icon={FaMoneyBillWave} accentClass="bg-emerald-50 text-emerald-600 border border-emerald-100" hint={metrics.compIngresos} hintType="up" />
      <StatCard label="Pedidos Completados" value={metrics.pedidosCompletados} icon={FaShoppingCart} accentClass="bg-blue-50 text-blue-600 border border-blue-100" hint={metrics.compPedidos} hintType="up" />
      <StatCard label="Productos Vendidos" value={metrics.productosVendidos} icon={FaBoxOpen} accentClass="bg-orange-50 text-orange-600 border border-orange-100" hint={metrics.compProductos} hintType="up" />
      <StatCard label="Ticket Promedio" value={metrics.ticketPromedio} icon={FaChartLine} accentClass="bg-purple-50 text-purple-600 border border-purple-100" hint={metrics.compTicket} hintType="down" />
    </div>
  );
};

export default React.memo(TarjetasMetricas);