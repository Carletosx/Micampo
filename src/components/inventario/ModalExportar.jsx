import React, { useState } from 'react';

const ModalExportar = ({ isOpen, onClose, onExport }) => {
  const [formato, setFormato] = useState('xlsx');
  if (!isOpen) return null;

  const handleExport = () => {
    if (typeof onExport === 'function') {
      onExport(formato);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Exportar inventario</h3>
        <p className="text-sm text-gray-500 mb-4">Selecciona el formato de exportación</p>
        <div className="space-y-2 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="formato" value="pdf" onChange={(e) => setFormato(e.target.value)} />
            <span>PDF</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="formato" value="xlsx" defaultChecked onChange={(e) => setFormato(e.target.value)} />
            <span>Excel (.xlsx)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="formato" value="csv" onChange={(e) => setFormato(e.target.value)} />
            <span>CSV</span>
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExportar;