import React from 'react';

const RadioRow = ({ value, label, desc, price, selected, onChange }) => (
  <label className={`flex items-center justify-between border rounded-md p-4 mb-3 cursor-pointer ${selected === value ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
    <div className="flex items-center">
      <input type="radio" name="metodoEnvio" checked={selected === value} onChange={() => onChange({ metodo: value, costo: price })} className="mr-3 text-green-600 focus:ring-green-500" />
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
    <span className="text-sm font-medium text-gray-900">{price === 0 ? 'Gratis' : `S/ ${price.toFixed(2)}`}</span>
  </label>
);

const MetodoEnvio = ({ value, onChange }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Método de Envío</h2>
      <RadioRow value="estandar" label="Envío Estándar" desc="Entregado en 2-5 días hábiles" price={10} selected={value.metodo} onChange={onChange} />
      <RadioRow value="express" label="Envío Express" desc="Entregado en 24-48 horas" price={25} selected={value.metodo} onChange={onChange} />
      <RadioRow value="recojo" label="Recojo en Tienda" desc="Disponible hoy" price={0} selected={value.metodo} onChange={onChange} />
    </section>
  );
};

export default MetodoEnvio;