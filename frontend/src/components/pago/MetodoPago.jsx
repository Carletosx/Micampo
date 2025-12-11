import React from 'react';

const MetodoPago = ({ value, onChange, errors }) => {
  const setMetodo = (metodo) => {
    onChange(prev => ({ ...prev, metodo }));
  };

  const setTarjeta = (field, val) => {
    onChange(prev => ({ ...prev, tarjeta: { ...prev.tarjeta, [field]: val } }));
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Método de Pago</h2>

      {/* Tarjeta */}
      <label className={`flex items-center justify-between border rounded-md p-4 mb-3 cursor-pointer ${value.metodo === 'tarjeta' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <input type="radio" name="metodoPago" checked={value.metodo === 'tarjeta'} onChange={() => setMetodo('tarjeta')} className="mr-3 text-green-600 focus:ring-green-500" />
          <div>
            <p className="font-medium text-gray-900">Tarjeta de Crédito/Débito</p>
            <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
          </div>
        </div>
      </label>
      {value.metodo === 'tarjeta' && (
        <div className="mb-3 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarjeta</label>
          <div id="stripe-card-element" className="w-full rounded-md border px-3 py-2 border-gray-300" />
          <p className="mt-1 text-xs text-gray-500">Procesado de forma segura por Stripe.</p>
        </div>
      )}

      {/* Contra entrega */}
      <label className={`flex items-center justify-between border rounded-md p-4 mb-3 cursor-pointer ${value.metodo === 'contra_entrega' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <input type="radio" name="metodoPago" checked={value.metodo === 'contra_entrega'} onChange={() => setMetodo('contra_entrega')} className="mr-3 text-green-600 focus:ring-green-500" />
          <div>
            <p className="font-medium text-gray-900">Pago Contra Entrega</p>
            <p className="text-sm text-gray-500">Pagas cuando recibes tu pedido</p>
          </div>
        </div>
      </label>

      {/* Yape/Plin */}
      <label className={`flex items-center justify-between border rounded-md p-4 mb-3 cursor-pointer ${value.metodo === 'yape' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <input type="radio" name="metodoPago" checked={value.metodo === 'yape'} onChange={() => setMetodo('yape')} className="mr-3 text-green-600 focus:ring-green-500" />
          <div>
            <p className="font-medium text-gray-900">Yape / Plin</p>
            <p className="text-sm text-gray-500">Pago móvil</p>
          </div>
        </div>
      </label>

      <div className="text-xs text-gray-500 mt-2">Tarjeta se procesa con Stripe. Yape/Plin y Contra Entrega se coordinan al momento de la entrega.</div>
    </section>
  );
};

export default MetodoPago;
