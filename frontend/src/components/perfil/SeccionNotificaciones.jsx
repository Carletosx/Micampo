import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

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

const Row = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-white">
    <span className="text-gray-700 text-sm">{label}</span>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const SeccionNotificaciones = () => {
  const { showSuccess } = useNotification();
  const [prefs, setPrefs] = useState({
    email: true,
    nuevosPedidos: true,
    mensajesClientes: true,
    stockBajo: true,
    resumenSemanal: true,
    promociones: false,
  });

  const update = (key, value) => setPrefs(prev => ({ ...prev, [key]: value }));

  const save = () => {
    showSuccess('Preferencias de notificaciones guardadas.');
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Notificaciones</h2>
        <button onClick={save} className="px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50">Guardar Preferencias</button>
      </div>

      <div className="space-y-3">
        <Row label="Recibir notificaciones por email" checked={prefs.email} onChange={(v) => update('email', v)} />
        <Row label="Notificaciones de nuevos pedidos" checked={prefs.nuevosPedidos} onChange={(v) => update('nuevosPedidos', v)} />
        <Row label="Notificaciones de mensajes de clientes" checked={prefs.mensajesClientes} onChange={(v) => update('mensajesClientes', v)} />
        <Row label="Alertas de stock bajo" checked={prefs.stockBajo} onChange={(v) => update('stockBajo', v)} />
        <Row label="Resumen semanal de ventas" checked={prefs.resumenSemanal} onChange={(v) => update('resumenSemanal', v)} />
        <Row label="Promociones y novedades" checked={prefs.promociones} onChange={(v) => update('promociones', v)} />
      </div>
    </section>
  );
};

export default React.memo(SeccionNotificaciones);