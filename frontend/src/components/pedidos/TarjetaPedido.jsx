import React from 'react';
import { FaLeaf, FaTruck, FaFileInvoice, FaQuestionCircle } from 'react-icons/fa';
import TimelinePedido from './TimelinePedido';
import { useNotification } from '../../contexts/NotificationContext';

const StatusBadge = ({ status }) => {
  const map = {
    en_proceso: { label: 'En proceso', className: 'bg-yellow-100 text-yellow-700' },
    en_camino: { label: 'En camino', className: 'bg-blue-100 text-blue-700' },
    entregados: { label: 'Entregado', className: 'bg-green-100 text-green-700' },
    cancelados: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
  };
  const conf = map[status] || { label: 'Desconocido', className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${conf.className}`}>{conf.label}</span>
  );
};

const TarjetaPedido = ({ order, onTrack, onInvoice, onHelp }) => {
  const { showInfo } = useNotification();

  const handleTrack = () => {
    onTrack?.(order);
    showInfo('Rastreo del pedido disponible próximamente.');
  };
  const handleInvoice = () => {
    onInvoice?.(order);
    showInfo('Descarga de factura disponible próximamente.');
  };
  const handleHelp = () => {
    onHelp?.(order);
    showInfo('Nuestro equipo de soporte se comunicará contigo.');
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      {/* Encabezado */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Pedido #{order.id}</span>
          <span className="ml-2 text-xs text-gray-500">{order.dateLabel}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Vendedor y productos */}
      <div className="p-4">
        {/* Vendedor */}
        {order.vendor && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
              {order.vendor.initials || 'FL'}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{order.vendor.name}</div>
              {order.vendor.rating && (
                <div className="text-xs text-gray-500">★ {order.vendor.rating} ({order.vendor.reviews || 156} reseñas)</div>
              )}
            </div>
          </div>
        )}

        {/* Productos */}
        <ul className="space-y-3">
          {order.items.map((item, idx) => (
            <li key={item.id || idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text='; }} />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                    <FaLeaf className="text-green-600" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.quantity} {item.unit} × S/ {item.unitPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-green-700">S/ {(item.quantity * item.unitPrice).toFixed(2)}</div>
            </li>
          ))}
        </ul>

        {/* Timeline */}
        {order.timeline && (
          <div className="mt-4">
            <TimelinePedido events={order.timeline} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="text-sm">
          <span className="text-gray-600">Total pagado</span>
          <span className="ml-2 text-green-700 font-bold">S/ {order.total.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleTrack} className="px-3 py-1.5 rounded-md text-sm bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1">
            <FaTruck /> <span>Rastrear</span>
          </button>
          <button onClick={handleInvoice} className="px-3 py-1.5 rounded-md text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-1">
            <FaFileInvoice /> <span>Factura</span>
          </button>
          <button onClick={handleHelp} className="px-3 py-1.5 rounded-md text-sm bg-pink-100 text-pink-700 hover:bg-pink-200 flex items-center gap-1">
            <FaQuestionCircle /> <span>Ayuda</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaPedido;