import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const validatePassword = (value) => {
  const minLen = value.length >= 8;
  const upper = /[A-Z]/.test(value);
  const lower = /[a-z]/.test(value);
  const digit = /\d/.test(value);
  return minLen && upper && lower && digit;
};

const ModalCambiarContrasena = ({ isOpen, onClose, onSave }) => {
  const { showError, showSuccess } = useNotification();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newErrors = {};
    if (!current) newErrors.current = 'Ingresa tu contraseña actual';
    if (!validatePassword(next)) newErrors.next = 'Mínimo 8 caracteres, incluir mayúscula, minúscula y número';
    if (next !== confirm) newErrors.confirm = 'La confirmación no coincide';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSave?.(next);
      showSuccess('Contraseña actualizada correctamente.');
      onClose();
    } else {
      showError('Corrige los campos marcados en rojo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Cambiar Contraseña</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Contraseña Actual</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className={`w-full rounded-md border px-3 py-2 ${errors.current ? 'border-red-400' : 'border-gray-300'}`} />
            {errors.current && <p className="text-xs text-red-600 mt-1">{errors.current}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nueva Contraseña</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={`w-full rounded-md border px-3 py-2 ${errors.next ? 'border-red-400' : 'border-gray-300'}`} />
            {errors.next && <p className="text-xs text-red-600 mt-1">{errors.next}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`w-full rounded-md border px-3 py-2 ${errors.confirm ? 'border-red-400' : 'border-gray-300'}`} />
            {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSubmit} className="px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModalCambiarContrasena);