import React from 'react';
import { Link } from 'react-router-dom';

const AlertCard = ({ producto, tone }) => {
  const tones = {
    critico: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      mensaje: `Stock crítico: ${producto.stockActual} kg restantes`
    },
    bajo: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      mensaje: `Stock bajo: ${producto.stockActual} kg restantes`
    }
  };
  const t = tones[tone || 'bajo'] || tones.bajo;
  
  return (
    <div className={`rounded-lg p-4 border ${t.bg} ${t.border} flex items-center justify-between`}>
      <div>
        <h4 className={`font-semibold ${t.text}`}>{producto.nombre}</h4>
        <p className="text-sm text-gray-600 mt-1">{t.mensaje}</p>
        <p className="text-xs text-gray-500 mt-1">Mínimo: {producto.stockMinimo} kg</p>
      </div>
      <Link 
        to="/agricultor/inventario"
        className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 whitespace-nowrap"
      >
        Reponer
      </Link>
    </div>
  );
};

const AlertasInventario = ({ alertas = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Alertas de Inventario</h3>
      {alertas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">✓ Todos tus productos tienen stock suficiente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((producto) => (
            <AlertCard 
              key={producto.id} 
              producto={producto} 
              tone={producto.estado}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertasInventario;