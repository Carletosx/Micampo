import React, { useMemo, useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { listFincas, createFinca, updateFinca } from '../../api/users.js';

const SeccionInformacionFinca = () => {
  const { showSuccess, showError } = useNotification();

  const initial = useMemo(() => ({
    id: null,
    nombreFinca: '',
    descripcion: '',
    region: '',
    provincia: '',
    direccion: '',
    distrito: '',
    postal: '',
    gps: '',
  }), []);

  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      const { ok, data, unauthorized } = await listFincas(0, 1);
      if (unauthorized) { showError('Tu sesión expiró.'); return }
      if (ok && Array.isArray(data) && data.length) {
        const f = data[0];
        setForm({
          id: f.id,
          nombreFinca: f.nombre || '',
          descripcion: f.descripcion || '',
          region: f.ubicacion || '',
          provincia: '',
          direccion: '',
          distrito: '',
          postal: '',
          gps: '',
        });
      }
    };
    load();
  }, []);

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

  const handleSave = async () => {
    if (!validate()) { showError('Revisa los campos marcados.'); return; }
    const ok = window.confirm('¿Confirmas guardar los cambios de la Finca?');
    if (!ok) return;
    const payload = { nombre: form.nombreFinca, ubicacion: form.region, descripcion: form.descripcion };
    let res;
    if (form.id) res = await updateFinca(form.id, payload);
    else res = await createFinca(payload);
    if (res.unauthorized) { showError('Tu sesión expiró.'); return }
    if (res.ok) { setEditing(false); showSuccess('Información de la finca actualizada.'); if (!form.id) setForm({ ...form, id: res.data.id }) }
    else showError('No se pudo guardar la finca');
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
