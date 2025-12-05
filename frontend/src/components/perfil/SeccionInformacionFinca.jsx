import React, { useMemo, useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const SeccionInformacionFinca = () => {
  const { showSuccess, showError } = useNotification();

  const initial = useMemo(() => ({
    nombreFinca: 'Finca Los Andes',
    descripcion: 'Finca familiar dedicada al cultivo orgánico de productos andinos. Contamos con 15 hectáreas de terreno certificado para agricultura orgánica',
    region: 'Lima',
    provincia: 'Cañete',
    direccion: 'Km 143 Panamericana Sur, Valle de Cañete',
    distrito: '',
    postal: '',
    gps: '',
  }), []);

  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombreFinca?.trim()) e.nombreFinca = 'Nombre de la Finca es obligatorio';
    if (!form.descripcion?.trim()) e.descripcion = 'Descripción es obligatoria';
    if (!form.region?.trim()) e.region = 'Región es obligatoria';
    if (!form.provincia?.trim()) e.provincia = 'Provincia es obligatoria';
    if (!form.direccion?.trim()) e.direccion = 'Dirección es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) { showError('Revisa los campos marcados.'); return; }
    const ok = window.confirm('¿Confirmas guardar los cambios de la Finca?');
    if (!ok) return;
    setEditing(false);
    showSuccess('Información de la finca actualizada.');
  };

  const handleCancel = () => {
    setForm(initial);
    setErrors({});
    setEditing(false);
  };

  const Input = ({ label, required, value, onChange, type = 'text', name }) => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={!editing}
        className={`w-full rounded-md border px-3 py-2 ${errors[name] ? 'border-red-400' : 'border-gray-300'} ${!editing ? 'bg-gray-100 text-gray-700' : 'bg-white'}`}
      />
      {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Información de la Finca</h2>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50">Editar</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} className="px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50">Guardar Cambios</button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Input label="Nombre de la Finca" required name="nombreFinca" value={form.nombreFinca} onChange={(v) => setForm({ ...form, nombreFinca: v })} />
        <div>
          <label className="block text-sm text-gray-700 mb-1">Descripción<span className="text-red-500">*</span></label>
          <textarea
            name="descripcion"
            rows={4}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            disabled={!editing}
            className={`w-full rounded-md border px-3 py-2 ${errors.descripcion ? 'border-red-400' : 'border-gray-300'} ${!editing ? 'bg-gray-100 text-gray-700' : 'bg-white'}`}
          />
          {errors.descripcion && <p className="text-xs text-red-600 mt-1">{errors.descripcion}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Región" required name="region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} />
          <Input label="Provincia" required name="provincia" value={form.provincia} onChange={(v) => setForm({ ...form, provincia: v })} />
          <Input label="Dirección Completa" required name="direccion" value={form.direccion} onChange={(v) => setForm({ ...form, direccion: v })} />
          <Input label="Distrito" name="distrito" value={form.distrito} onChange={(v) => setForm({ ...form, distrito: v })} />
          <Input label="Código Postal" name="postal" value={form.postal} onChange={(v) => setForm({ ...form, postal: v })} />
          <Input label="Coordenadas GPS" name="gps" value={form.gps} onChange={(v) => setForm({ ...form, gps: v })} />
        </div>
      </div>
    </section>
  );
};

export default React.memo(SeccionInformacionFinca);