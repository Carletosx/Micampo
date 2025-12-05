import React from 'react';
import { FaShoppingBag, FaShoppingCart, FaMoneyBillWave, FaStar } from 'react-icons/fa';

const StatCard = ({ icon: Icon, iconClass, title, value, hint }) => (
  <div className="bg-white rounded-lg shadow-sm p-5 flex items-start gap-4">
    <div className={`p-3 rounded-full ${iconClass}`}>
      <Icon className="text-xl" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </div>
  </div>
);

const TarjetasEstadisticas = ({
  data = {
    publicados: 45,
    nuevosSemana: 3,
    pedidosMes: 128,
    incrementoPedidos: 18,
    ingresosMes: 'S/ 8,450',
    incrementoIngresos: 12,
    calificacion: 4.8,
    reseñas: 156,
  },
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={FaShoppingBag}
        iconClass="bg-orange-100 text-orange-500"
        title="Productos Publicados"
        value={data.publicados}
        hint={`↑ ${data.nuevosSemana} nuevos esta semana`}
      />
      <StatCard
        icon={FaShoppingCart}
        iconClass="bg-blue-100 text-blue-600"
        title="Pedidos Este Mes"
        value={data.pedidosMes}
        hint={`↑ ${data.incrementoPedidos}% vs mes anterior`}
      />
      <StatCard
        icon={FaMoneyBillWave}
        iconClass="bg-red-100 text-red-600"
        title="Ingresos del Mes"
        value={data.ingresosMes}
        hint={`↑ ${data.incrementoIngresos}% vs mes anterior`}
      />
      <StatCard
        icon={FaStar}
        iconClass="bg-green-100 text-green-600"
        title="Calificación Promedio"
        value={data.calificacion}
        hint={`Basado en ${data.reseñas} reseñas`}
      />
    </div>
  );
};

export default TarjetasEstadisticas;