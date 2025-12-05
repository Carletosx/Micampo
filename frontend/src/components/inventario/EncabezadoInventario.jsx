import React from 'react';
import { FaDownload, FaBox } from 'react-icons/fa';

const EncabezadoInventario = ({
  titulo = 'Gestión de Inventario',
  subtitulo = 'Control total de tus existencias y alertas de stock',
  onExport,
  onActualizarStock,
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{titulo}</h1>
        <p className="text-sm text-gray-500">{subtitulo}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-green-600 text-green-700 rounded-md hover:bg-green-50"
        >
          <span role="img" aria-label="export">📥</span>
          <span>Exportar</span>
        </button>
        <button
          type="button"
          onClick={onActualizarStock}
          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <span role="img" aria-label="update">📦</span>
          <span>Actualizar Stock</span>
        </button>
      </div>
    </div>
  );
};

export default EncabezadoInventario;