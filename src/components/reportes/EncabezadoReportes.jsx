import React from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

const EncabezadoReportes = ({
  titulo = 'Reportes y Estadísticas',
  subtitulo = 'Analiza el rendimiento de tus ventas y productos',
  onExportPDF,
  onExportExcel,
}) => {
  return (
    <div className="mb-4">
      <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{titulo}</h1>
            <p className="mt-1 text-sm md:text-base text-gray-700">{subtitulo}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 flex items-center gap-2"
              onClick={onExportPDF}
            >
              <FaFilePdf className="text-red-600" /> Exportar PDF
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 flex items-center gap-2"
              onClick={onExportExcel}
            >
              <FaFileExcel className="text-green-600" /> Exportar Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncabezadoReportes;