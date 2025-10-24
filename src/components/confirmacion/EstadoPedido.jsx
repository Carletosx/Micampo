import React from 'react';
import { FaCheckCircle, FaClock, FaTruck, FaHome } from 'react-icons/fa';

const steps = [
  { key: 'Confirmado', icon: FaCheckCircle },
  { key: 'En Preparación', icon: FaClock },
  { key: 'En Camino', icon: FaTruck },
  { key: 'Entregado', icon: FaHome }
];

const EstadoPedido = ({ estadoActual }) => {
  const currentIndex = steps.findIndex(s => s.key === estadoActual);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Estado del Pedido</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const completed = index <= currentIndex;
            return (
              <div key={step.key} className={`flex items-center gap-2 p-3 rounded-md border ${completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <Icon className={`${completed ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="text-sm">
                  <p className={`font-medium ${completed ? 'text-green-700' : 'text-gray-600'}`}>{step.key}</p>
                  <p className="text-xs text-gray-500">{completed ? 'Completado' : 'Pendiente'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EstadoPedido;