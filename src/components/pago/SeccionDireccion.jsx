import React from 'react';

const DireccionCard = ({ id, titulo, direccion, referencia, telefono, selected, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    className={`w-full text-left border rounded-md p-4 mb-3 hover:bg-gray-50 ${selected === id ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
  >
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-gray-900">{titulo}</h3>
      {selected === id && <span className="text-xs text-green-600">Seleccionado</span>}
    </div>
    <p className="text-sm text-gray-600 mt-1">{direccion}</p>
    {referencia && <p className="text-sm text-gray-500">{referencia}</p>}
    {telefono && <p className="text-sm text-gray-500">{telefono}</p>}
  </button>
);

const SeccionDireccion = ({ selected, onSelect }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Dirección de Entrega</h2>
        <button className="text-sm text-green-600 hover:text-green-700">+ Nueva Dirección</button>
      </div>
      <DireccionCard
        id="casa"
        titulo="Casa"
        direccion="Av. Los Pinos 754, San Isidro"
        referencia="Referencia: Cerca del parque, puerta verde"
        telefono="Teléfono: +51 987 654 321"
        selected={selected}
        onSelect={onSelect}
      />
      <DireccionCard
        id="oficina"
        titulo="Oficina"
        direccion="Av. Los Robles 456, Oficina 202"
        referencia="Referencia: Centro corporativo, tercer piso"
        telefono=""
        selected={selected}
        onSelect={onSelect}
      />
    </section>
  );
};

export default SeccionDireccion;