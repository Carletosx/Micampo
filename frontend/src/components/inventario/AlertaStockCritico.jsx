import React from 'react';

const AlertaStockCritico = ({
  count = 5,
  texto = '5 productos requieren atención inmediata',
  subtexto = 'Tienes productos con stock crítico que necesitan reposición',
  onVerAlertas,
}) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-semibold">{texto}</p>
          <p className="text-sm text-yellow-700">{subtexto}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onVerAlertas}
        className="px-3 py-2 text-sm bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200"
      >
        Ver Alertas
      </button>
    </div>
  );
};

export default AlertaStockCritico;