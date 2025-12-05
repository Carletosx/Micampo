import React, { useEffect, useState } from 'react';

const ModalActualizarStock = ({ isOpen, producto, onClose, onSave }) => {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    if (producto) {
      setCantidad(producto.stockActual);
    }
  }, [producto]);

  if (!isOpen || !producto) return null;

  const handleSave = () => {
    if (typeof onSave === 'function') {
      onSave({ ...producto, stockActual: Number(cantidad) });
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Actualizar Stock</h3>
        <p className="text-sm text-gray-500 mb-4">{producto.nombre}</p>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Cantidad ({producto.unidad})</label>
          <input
            type="number"
            min="0"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalActualizarStock;