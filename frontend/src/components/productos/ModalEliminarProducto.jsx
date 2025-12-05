import React from 'react';

export default function ModalEliminarProducto({ isOpen, producto, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800">Confirmar eliminación</h2>
        <p className="text-sm text-gray-600 mt-2">
          ¿Estás seguro de eliminar "{producto?.nombre}"? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm?.(producto)}
            className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}