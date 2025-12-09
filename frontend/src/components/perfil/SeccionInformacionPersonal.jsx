import React, { useMemo, useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { getPerfil, updatePerfil } from '../../api/users.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitsOnly = (s) => (s || '').replace(/\D/g, '');
const maskDNI = (dni) => {
  const d = digitsOnly(dni);
  if (d.length < 4) return d;
  return `${d.slice(0, 4)}****`;
};

const SeccionInformacionPersonal = () => {
  const { showSuccess, showError } = useNotification();

  const initial = useMemo(() => ({ nombres: '', apellidos: '', email: '', telefono: '+51 ', dni: '', registro: '—' }), []);

  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      const { ok, data, unauthorized } = await getPerfil();
      if (unauthorized) { showError('Tu sesión expiró.'); return }
      if (ok && data) {
        setForm({
          nombres: data.nombres || '',
          apellidos: data.apellidos || '',
          email: data.email || '',
          telefono: data.telefono || '+51 ',
          dni: data.dni || '',
          registro: '—',
        });
      }
    };
    load();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nombres?.trim()) e.nombres = 'Nombres es obligatorio';
    if (!form.apellidos?.trim()) e.apellidos = 'Apellidos es obligatorio';
    if (!emailRegex.test(form.email)) e.email = 'Formato de email inválido';
    const phoneDigits = digitsOnly(form.telefono);
    if (!(phoneDigits.startsWith('51') && phoneDigits.length === 11)) {
      e.telefono = 'Debe ser +51 seguido de 9 dígitos';
    }
    const dniDigits = digitsOnly(form.dni);
    if (dniDigits.length !== 8) e.dni = 'El DNI debe tener 8 dígitos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) { showError('Revisa los campos marcados.'); return; }
    const confirmed = window.confirm('¿Confirmas guardar los cambios de Información Personal?');
    if (!confirmed) return;
    const payload = { nombres: form.nombres, apellidos: form.apellidos, email: form.email, telefono: form.telefono, dni: form.dni };
    const { ok, unauthorized } = await updatePerfil(payload);
    if (unauthorized) { showError('Tu sesión expiró. Inicia nuevamente.'); return }
    if (ok) {
      setEditing(false);
      showSuccess('Información personal actualizada.');
    } else {
      showError('Error al actualizar perfil');
    }
  };

  const handleCancel = () => {
    setForm(initial);
    setErrors({});
    setEditing(false);
  };

  const Input = ({ label, required, value, onChange, type = 'text', name, readonly }) => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={!editing || readonly}
        readOnly={readonly}
        className={`w-full rounded-md border px-3 py-2 ${errors[name] ? 'border-red-400' : 'border-gray-300'} ${!editing || readonly ? 'bg-gray-100 text-gray-700' : 'bg-white'}`}
      />
      {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Información Personal</h2>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50">Editar</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} className="px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50">Guardar Cambios</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombres" required name="nombres" value={form.nombres} onChange={(v) => setForm({ ...form, nombres: v })} />
        <Input label="Apellidos" required name="apellidos" value={form.apellidos} onChange={(v) => setForm({ ...form, apellidos: v })} />
        <Input label="Correo Electrónico" required name="email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Input label="Teléfono" required name="telefono" type="tel" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
        <Input label="DNI" required name="dni" value={editing ? form.dni : maskDNI(form.dni)} onChange={(v) => setForm({ ...form, dni: v })} />
        <Input label="Fecha de Registro" name="registro" value={form.registro} readonly />
      </div>
    </section>
  );
};

export default React.memo(SeccionInformacionPersonal);
