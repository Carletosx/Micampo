import React, { useState } from 'react';
import { FaShieldAlt, FaSignOutAlt, FaTrash, FaKey } from 'react-icons/fa';
import { useNotification } from '../../contexts/NotificationContext';
import ModalCambiarContrasena from './ModalCambiarContrasena';

const Toggle = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-1'}`}></span>
  </button>
);

const SeccionSeguridad = () => {
  const { showInfo, showSuccess, showError } = useNotification();
  const [twoFA, setTwoFA] = useState(false);
  const [openPwd, setOpenPwd] = useState(false);

  const sesiones = [
    { id: 1, dispositivo: 'Chrome en Windows 11', fecha: '2025-09-20 18:25' },
    { id: 2, dispositivo: 'Safari en iOS', fecha: '2025-09-19 08:40' },
    { id: 3, dispositivo: 'Edge en macOS', fecha: '2025-09-15 12:05' },
  ];

  const cerrarSesiones = () => {
    const ok = window.confirm('¿Cerrar todas las sesiones activas?');
    if (!ok) return;
    showInfo('Se cerraron todas las sesiones activas.');
  };

  const eliminarCuenta = () => {
    const ok1 = window.confirm('Esta acción es irreversible. ¿Deseas continuar?');
    if (!ok1) return;
    const confirmText = window.prompt('Escribe ELIMINAR para confirmar:');
    if (confirmText !== 'ELIMINAR') { showError('Confirmación inválida.'); return; }
    const ok2 = window.confirm('Último paso: ¿Confirmas eliminar permanentemente tu cuenta?');
    if (!ok2) return;
    showSuccess('Cuenta eliminada (simulado).');
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Seguridad</h2>
        <button onClick={() => setOpenPwd(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50"><FaKey /> Cambiar Contraseña</button>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-600" />
              <span className="text-gray-800">Autenticación de dos factores</span>
            </div>
            <Toggle checked={twoFA} onChange={setTwoFA} />
          </div>
          <p className="text-xs text-gray-600 mt-2">Añade una capa adicional de seguridad a tu cuenta.</p>
        </div>

        <div className="p-4 rounded-md border border-gray-200">
          <h3 className="text-gray-800 font-medium mb-2">Últimas sesiones activas</h3>
          <ul className="divide-y divide-gray-100">
            {sesiones.map(s => (
              <li key={s.id} className="py-2 flex items-center justify-between">
                <span className="text-sm text-gray-700">{s.dispositivo}</span>
                <span className="text-xs text-gray-500">{s.fecha}</span>
              </li>
            ))}
          </ul>
          <button onClick={cerrarSesiones} className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"><FaSignOutAlt /> Cerrar todas las sesiones</button>
        </div>

        <div className="p-4 rounded-md border border-red-200 bg-red-50">
          <h3 className="text-red-700 font-medium mb-2">Eliminar cuenta</h3>
          <p className="text-xs text-red-700 mb-3">Esta acción no se puede deshacer. Se requerirá confirmación múltiple.</p>
          <button onClick={eliminarCuenta} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-red-600 text-red-700 bg-white hover:bg-red-50"><FaTrash /> Eliminar cuenta</button>
        </div>
      </div>

      <ModalCambiarContrasena isOpen={openPwd} onClose={() => setOpenPwd(false)} />
    </section>
  );
};

export default React.memo(SeccionSeguridad);