import React from 'react';
import { FaLeaf } from 'react-icons/fa';

const DetallesPedido = ({ vendedor, productos = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Detalles del Pedido</h2>
      </div>
      <div className="p-6">
        {/* Vendedor */}
        {vendedor && (
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 text-green-600 p-2 rounded-full">
              <FaLeaf />
            </div>
            <div>
              <p className="font-medium text-gray-900">{vendedor.nombre}</p>
              <p className="text-sm text-gray-500">{vendedor.ubicacion}</p>
            </div>
          </div>
        )}

        {/* Productos */}
        <ul className="space-y-3">
          {productos.map((item, idx) => (
            <li key={item.cartItemId || item.id || idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name || item.nombre} className="w-10 h-10 rounded object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/40x40?text='; }} />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                    <FaLeaf className="text-green-600" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name || item.nombre}</p>
                  <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetallesPedido;