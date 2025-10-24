import React from 'react';

const ResumenCompra = ({ subtotal = 0, envio = 0, descuento = 0, total = 0 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Resumen de Compra</h2>
      </div>
      <div className="p-6 space-y-2 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Envío</span>
          <span>S/ {envio.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Descuento</span>
          <span className="text-red-600">- S/ {descuento.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="text-base font-medium text-gray-900">Total Pagado</span>
          <span className="text-base font-bold text-green-600">S/ {total.toFixed(2)}</span>
        </div>
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-xs">
          <p>¡Sigue tu pedido en tiempo real!</p>
          <p>Te avisaremos cuando cambie el estado de tu pedido.</p>
        </div>
      </div>
    </div>
  );
};

export default ResumenCompra;