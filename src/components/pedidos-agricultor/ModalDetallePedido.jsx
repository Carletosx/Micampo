import React from 'react';

const STATUS_CONF = {
  pendiente: { label: 'Pendiente de confirmación', badge: 'bg-yellow-100 text-yellow-800' },
  en_proceso: { label: 'En proceso', badge: 'bg-blue-100 text-blue-800' },
  enviado: { label: 'Enviado', badge: 'bg-purple-100 text-purple-800' },
  entregado: { label: 'Entregado', badge: 'bg-green-100 text-green-800' },
  cancelado: { label: 'Cancelado', badge: 'bg-red-100 text-red-800' },
};

const ModalDetallePedido = ({ order, onClose }) => {
  if (!order) return null;
  const conf = STATUS_CONF[order.status] || STATUS_CONF.pendiente;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Pedido #{order.id} — Detalles</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${conf.badge}`}>{conf.label}</span>
            </div>
            <button className="text-gray-600 hover:text-gray-800" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Cliente</h4>
            <p className="text-sm text-gray-600">{order.client.name} — {order.client.email} — {order.client.phone}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-800">Productos</h4>
            <div className="mt-2 space-y-2">
              {order.products.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span>{p.name} ({p.qty} {p.unit})</span>
                  <span className="text-gray-700">S/ {p.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Entrega</h4>
              <p className="text-sm text-gray-600">Dirección: {order.shipping.address}</p>
              <p className="text-sm text-gray-600">Fecha estimada: {order.shipping.estimatedDelivery}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Pago</h4>
              <p className="text-sm text-gray-600">Método: {order.payment.method}</p>
              <p className="text-sm text-gray-600">Total: S/ {order.total.toFixed(2)}</p>
            </div>
          </div>

          {order.notes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Notas del cliente</h4>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallePedido;