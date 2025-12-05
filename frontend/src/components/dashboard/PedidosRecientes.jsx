import React from 'react';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const map = {
    Pendiente: 'bg-yellow-100 text-yellow-700',
    'En proceso': 'bg-blue-100 text-blue-700',
    Completado: 'bg-green-100 text-green-700',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-700';
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
};

const PedidoItem = ({ pedido }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">Pedido <span className="font-semibold">#{pedido.numero}</span></p>
      <p className="text-xs text-gray-500">{pedido.tiempo} • {pedido.productos} productos</p>
    </div>
    <div className="flex items-center gap-4">
      <p className="font-semibold text-gray-800">{pedido.monto}</p>
      <StatusBadge status={pedido.estado} />
    </div>
  </div>
);

const PedidosRecientes = () => {
  const pedidos = [
    { numero: 1247, tiempo: 'hace 2 h', productos: 3, monto: 'S/ 55.00', estado: 'En proceso' },
    { numero: 1246, tiempo: 'hace 1 día', productos: 5, monto: 'S/ 120.50', estado: 'Pendiente' },
    { numero: 1241, tiempo: 'hace 3 días', productos: 2, monto: 'S/ 35.00', estado: 'Completado' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Pedidos Recientes</h3>
        <Link to="/agricultor/pedidos" className="text-green-600 hover:text-green-700 text-sm font-medium">
          Ver todos los pedidos
        </Link>
      </div>
      <div className="space-y-3">
        {pedidos.map((p) => (
          <PedidoItem key={p.numero} pedido={p} />
        ))}
      </div>
    </div>
  );
};

export default PedidosRecientes;