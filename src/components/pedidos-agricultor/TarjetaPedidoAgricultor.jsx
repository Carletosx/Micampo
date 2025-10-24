import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaClock } from 'react-icons/fa';

const STATUS_CONF = {
  pendiente: { label: 'Pendiente de confirmación', badge: 'bg-yellow-100 text-yellow-800', color: 'text-yellow-700' },
  en_proceso: { label: 'En proceso', badge: 'bg-blue-100 text-blue-800', color: 'text-blue-700' },
  enviado: { label: 'Enviado', badge: 'bg-purple-100 text-purple-800', color: 'text-purple-700' },
  entregado: { label: 'Entregado', badge: 'bg-green-100 text-green-800', color: 'text-green-700' },
  cancelado: { label: 'Cancelado', badge: 'bg-red-100 text-red-800', color: 'text-red-700' },
};

const STATUS_ACCENT = {
  pendiente: 'hover:ring-yellow-200',
  en_proceso: 'hover:ring-blue-200',
  enviado: 'hover:ring-purple-200',
  entregado: 'hover:ring-green-200',
  cancelado: 'hover:ring-red-200',
};

const Avatar = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('');
  return (
    <div className="h-9 w-9 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
      {initials}
    </div>
  );
};

const ProductoItem = ({ product }) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 bg-green-50 rounded-md border border-green-100 flex items-center justify-center overflow-hidden">
      {/* Thumbnail placeholder */}
      <span className="text-green-600 text-xs">{product.thumbnail || 'IMG'}</span>
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-800">{product.name}</div>
      <div className="text-xs text-gray-500">{product.qty} {product.unit} • S/ {product.price.toFixed(2)}</div>
    </div>
  </div>
);

const TarjetaPedidoAgricultor = ({ order, onViewDetails, onChangeStatus, onContact }) => {
  const conf = STATUS_CONF[order.status] || STATUS_CONF.pendiente;
  const accent = STATUS_ACCENT[order.status] || '';
  const productsPreview = order.products.slice(0, 3);
  const moreCount = order.products.length - productsPreview.length;

  return (
    <div className={`relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-shadow hover:shadow-md hover:ring-2 ${accent}`}>
      {order.urgent && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-xl" aria-hidden="true" />}
      {/* Encabezado */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">Pedido #{order.id}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${conf.badge}`}>{conf.label}</span>
            {order.urgent && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Urgente</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end text-xs text-gray-500">
            <FaClock className="mr-1" /> {order.timeAgo}
          </div>
          <div className="text-green-600 font-bold text-lg">S/ {order.total.toFixed(2)}</div>
        </div>
      </div>

      {/* Cliente */}
      <div className="mt-4 flex items-center gap-3">
        <Avatar name={order.client.name} />
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-800">{order.client.name}</div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
            <span className="flex items-center gap-1"><FaEnvelope /> {order.client.email}</span>
            <span className="flex items-center gap-1"><FaPhone /> {order.client.phone}</span>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="mt-4 space-y-2">
        {productsPreview.map((p, idx) => (
          <ProductoItem key={idx} product={p} />
        ))}
        {moreCount > 0 && (
          <button onClick={() => onViewDetails?.(order)} className="text-xs text-green-700 hover:underline">Ver más (+{moreCount})</button>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" /><span>{order.shipping.address}</span></div>
        <div className="flex items-center gap-2"><FaCreditCard className="text-gray-500" /><span>{order.payment.method}</span></div>
        <div className="flex items-center gap-2"><FaClock className="text-gray-500" /><span>{order.shipping.estimatedDelivery}</span></div>
      </div>
      {order.notes && (
        <div className="mt-2 text-xs text-gray-500">Nota: {order.notes}</div>
      )}

      {/* Acciones */}
      <div className="mt-4 flex flex-wrap gap-2">
        {/* Ver Detalles */}
        <button
          onClick={() => onViewDetails?.(order)}
          className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
        >
          👁️ Ver Detalles
        </button>

        {/* Contactar Cliente */}
        <button
          onClick={() => onContact?.(order)}
          className="px-3 py-2 text-sm rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
        >
          💬 Contactar Cliente
        </button>

        {/* Acciones por estado */}
        {order.status === 'pendiente' && (
          <>
            <button
              onClick={() => onChangeStatus?.(order, 'en_proceso')}
              className="px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              ✓ Confirmar Pedido
            </button>
            <button
              onClick={() => onChangeStatus?.(order, 'cancelado')}
              className="px-3 py-2 text-sm rounded-md bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
            >
              ✕ Cancelar
            </button>
          </>
        )}
        {order.status === 'en_proceso' && (
          <>
            <button
              onClick={() => onChangeStatus?.(order, 'enviado')}
              className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              📦 Marcar como Enviado
            </button>
            <button
              onClick={() => onChangeStatus?.(order, 'cancelado')}
              className="px-3 py-2 text-sm rounded-md bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
            >
              ✕ Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TarjetaPedidoAgricultor;