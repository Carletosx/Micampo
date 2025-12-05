import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const options = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
];

const ModalCambiarEstado = ({ order, targetStatus, onConfirm, onClose }) => {
  const [status, setStatus] = useState(targetStatus || order?.status || 'pendiente');
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-xl">
          <h3 className="text-lg font-semibold">Actualizar estado — Pedido #{order.id}</h3>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-start gap-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-md p-3">
            <FaInfoCircle className="mt-0.5" />
            <p className="text-xs">Selecciona el nuevo estado. Este cambio actualizará métricas y ayudará a tus clientes a seguir el progreso del pedido.</p>
          </div>

          <label className="text-sm text-gray-700" htmlFor="select-estado">Nuevo estado</label>
          <select
            id="select-estado"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Cancelar</button>
          <button onClick={() => onConfirm?.(order, status)} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalCambiarEstado;