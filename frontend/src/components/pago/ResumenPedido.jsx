import React from 'react';
import { useCart } from '../../contexts/CartContext';

const Line = ({ label, value, strong }) => (
  <div className="flex justify-between py-1">
    <span className={`text-sm ${strong ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{label}</span>
    <span className={`text-sm ${strong ? 'font-medium text-gray-900' : 'text-gray-900'}`}>S/ {Number(value).toFixed(2)}</span>
  </div>
);

const ResumenPedido = ({ envioCosto = 0, subtotal = 0, total = 0 }) => {
  const { cart } = useCart();

  return (
    <aside className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
      <div className="space-y-3 mb-4">
        {cart.map(item => (
          <div key={item.cartItemId || item.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name || item.nombre}</p>
                <p className="text-xs text-gray-500">x{item.quantity}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <Line label="Subtotal" value={subtotal} />
        <Line label="Envío" value={envioCosto} />
        <div className="border-t mt-3 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-medium text-gray-900">Total a Pagar</span>
            <span className="text-base font-bold text-green-600">S/ {Number(total).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">Acepta términos y condiciones para habilitar el pago.</p>
    </aside>
  );
};

export default ResumenPedido;