import React from 'react';

const AlertCard = ({ title, message, tone }) => {
  const tones = {
    red: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200'
    }
  };
  const t = tones[tone] || tones.yellow;
  return (
    <div className={`rounded-lg p-4 border ${t.bg} ${t.border} flex items-center justify-between`}>
      <div>
        <h4 className={`font-semibold ${t.text}`}>{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <button className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700">
        Reponer
      </button>
    </div>
  );
};

const AlertasInventario = () => {
  const alerts = [
    { title: 'Papa Blanca', message: 'Stock crítico: 5 kg restantes', tone: 'red' },
    { title: 'Tomates Cherry', message: 'Stock bajo: 12 kg restantes', tone: 'yellow' },
    { title: 'Lechuga Orgánica', message: 'Stock bajo: 8 unidades', tone: 'yellow' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Alertas de Inventario</h3>
      <div className="space-y-3">
        {alerts.map((a, idx) => (
          <AlertCard key={idx} title={a.title} message={a.message} tone={a.tone} />
        ))}
      </div>
    </div>
  );
};

export default AlertasInventario;