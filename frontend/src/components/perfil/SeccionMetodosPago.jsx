import React, { useState } from 'react';
import { FaCreditCard, FaUniversity, FaPlus, FaStar, FaTrash } from 'react-icons/fa';
import { useNotification } from '../../contexts/NotificationContext';

const PaymentCard = ({ method, isDefault, onSetDefault, onRemove }) => (
  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center gap-3">
      {method.type === 'card' ? (
        <FaCreditCard className="text-green-600" />
      ) : (
        <FaUniversity className="text-green-600" />
      )}
      <div>
        <p className="text-gray-800 font-medium">{method.label}</p>
        <p className="text-gray-600 text-sm">{method.details}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {isDefault ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-600 text-xs"><FaStar /> Predeterminado</span>
      ) : (
        <button onClick={onSetDefault} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">Hacer predeterminado</button>
      )}
      <button onClick={onRemove} className="px-3 py-2 rounded-md border border-red-600 text-red-700 bg-white hover:bg-red-50 text-sm"><FaTrash /> Eliminar</button>
    </div>
  </div>
);

const SeccionMetodosPago = () => {
  const { showInfo, showSuccess } = useNotification();
  const [methods, setMethods] = useState([
    { id: 'm1', type: 'card', label: 'Visa terminada en 1234', details: 'Vencimiento 08/26', default: true },
    { id: 'm2', type: 'card', label: 'Mastercard terminada en 5678', details: 'Vencimiento 03/27', default: false },
    { id: 'm3', type: 'bank', label: 'BCP Cuenta Corriente **** 4321', details: 'Titular: Juan Pérez', default: false },
  ]);

  const setDefault = (id) => {
    setMethods((prev) => prev.map(m => ({ ...m, default: m.id === id })));
    showSuccess('Método de pago establecido como predeterminado.');
  };

  const removeMethod = (id) => {
    setMethods((prev) => prev.filter(m => m.id !== id));
    showInfo('Método de pago eliminado.');
  };

  const addMethod = () => {
    showInfo('Funcionalidad para agregar métodos de pago próximamente.');
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Métodos de Pago</h2>
        <button onClick={addMethod} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50"><FaPlus /> Agregar Método de Pago</button>
      </div>

      <div className="space-y-3">
        {methods.map(m => (
          <PaymentCard key={m.id} method={m} isDefault={m.default} onSetDefault={() => setDefault(m.id)} onRemove={() => removeMethod(m.id)} />
        ))}
      </div>
    </section>
  );
};

export default React.memo(SeccionMetodosPago);