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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 px-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
            <input value={value.tarjeta.numero} onChange={e => setTarjeta('numero', e.target.value)} placeholder="1234 5678 9012 3456" className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors?.numero ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`} />
            {errors?.numero && <p className="mt-1 text-xs text-red-600">{errors.numero}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la Tarjeta</label>
            <input value={value.tarjeta.nombre} onChange={e => setTarjeta('nombre', e.target.value)} placeholder="Como aparece en la tarjeta" className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors?.nombreTarjeta ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`} />
            {errors?.nombreTarjeta && <p className="mt-1 text-xs text-red-600">{errors.nombreTarjeta}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
            <input value={value.tarjeta.vencimiento} onChange={e => setTarjeta('vencimiento', e.target.value)} placeholder="MM/AA" className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors?.vencimiento ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`} />
            {errors?.vencimiento && <p className="mt-1 text-xs text-red-600">{errors.vencimiento}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input value={value.tarjeta.cvv} onChange={e => setTarjeta('cvv', e.target.value)} placeholder="123" className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors?.cvv ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'}`} />
            {errors?.cvv && <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>}
          </div>
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

      {/* Transferencia */}
      <label className={`flex items-center justify-between border rounded-md p-4 mb-1 cursor-pointer ${value.metodo === 'transferencia' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <input type="radio" name="metodoPago" checked={value.metodo === 'transferencia'} onChange={() => setMetodo('transferencia')} className="mr-3 text-green-600 focus:ring-green-500" />
          <div>
            <p className="font-medium text-gray-900">Transferencia Bancaria</p>
            <p className="text-sm text-gray-500">BCP, Interbank, BBVA, Scotiabank</p>
          </div>
        </div>
      </label>
    </section>
  );
};

export default MetodoPago;