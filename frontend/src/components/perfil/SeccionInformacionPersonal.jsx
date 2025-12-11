import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useNotification } from '../../contexts/NotificationContext'
import { getPerfil, updatePerfil } from '../../api/users.js'
import Button from '../ui/Button'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const digitsOnly = (s) => (s || '').replace(/\D/g, '')
const maskDNI = (dni) => {
  const d = digitsOnly(dni)
  if (d.length < 4) return d
  return `${d.slice(0, 4)}****`
}

const SeccionInformacionPersonal = () => {
  const { showSuccess, showError } = useNotification();

  const initial = useMemo(() => ({ nombres: '', apellidos: '', telefono: '+51 ', dni: '' }), [])

  const [form, setForm] = useState(initial)
  const [formKey, setFormKey] = useState(0)
  const nombresRef = useRef(null)
  const apellidosRef = useRef(null)
  const telefonoRef = useRef(null)
  const dniRef = useRef(null)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const load = async () => {
      const { ok, data, unauthorized } = await getPerfil()
      if (unauthorized) { showError('Tu sesión expiró.'); return }
      let base = { nombres: '', apellidos: '', telefono: '+51 ', dni: '' }
      if (ok && data) {
        base = {
          nombres: data.nombres || '',
          apellidos: data.apellidos || '',
          telefono: data.telefono || '+51 ',
          dni: data.dni || '',
        }
      } else {
        try {
          const stored = sessionStorage.getItem('user') || localStorage.getItem('user')
          const u = stored ? JSON.parse(stored) : null
          if (u) {
            const parts = (u.displayName || '').trim().split(/\s+/)
            base.nombres = parts[0] || ''
            base.apellidos = parts.slice(1).join(' ') || ''
          }
        } catch {}
      }
      setForm(base)
      setEditing(false)
    }
    load()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.nombres?.trim()) e.nombres = 'Nombres es obligatorio'
    if (!form.apellidos?.trim()) e.apellidos = 'Apellidos es obligatorio'
    const phoneDigits = digitsOnly(form.telefono)
    if (!(phoneDigits.startsWith('51') && phoneDigits.length === 11)) {
      e.telefono = 'Debe ser +51 seguido de 9 dígitos'
    }
    const dniDigits = digitsOnly(form.dni)
    if (dniDigits.length !== 8) e.dni = 'El DNI debe tener 8 dígitos'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const [saving, setSaving] = useState(false)
  const handleSave = async () => {
    if (!validate()) { showError('Revisa los campos marcados.'); return; }
    const confirmed = window.confirm('¿Confirmas guardar los cambios de Información Personal?');
    if (!confirmed) return;
    const payload = { nombres: form.nombres, apellidos: form.apellidos, email: form.email, telefono: form.telefono, dni: form.dni };
    const { ok, unauthorized } = await updatePerfil(payload);
    if (unauthorized) { showError('Tu sesión expiró. Inicia nuevamente.'); return }
    if (ok) { setEditing(false); showSuccess('Información personal actualizada.') } else { showError('Error al actualizar perfil') }
  }

  const handleCancel = () => {
    setForm(initial)
    setErrors({})
    setFormKey((k) => k + 1)
  }

  const Field = ({ label, name, value, onChange, type = 'text', required, readonly }) => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={!!readonly}
        className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-400' : 'border-gray-300'} rounded-md bg-white`}
      />
      {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Información Personal</h2>
        <div className="flex gap-2">
          {!editing && <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Editar</Button>}
          {editing && <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>}
          {editing && <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>Guardar Cambios</Button>}
        </div>
      </div>
      <div key={formKey} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nombres<span className="text-red-500">*</span></label>
          <input ref={nombresRef} defaultValue={form.nombres} readOnly={!editing} className={`w-full px-3 py-2 border ${errors.nombres ? 'border-red-400' : 'border-gray-300'} rounded-md bg-white`} name="nombres" />
          {errors.nombres && <p className="text-xs text-red-600 mt-1">{errors.nombres}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Apellidos<span className="text-red-500">*</span></label>
          <input ref={apellidosRef} defaultValue={form.apellidos} readOnly={!editing} className={`w-full px-3 py-2 border ${errors.apellidos ? 'border-red-400' : 'border-gray-300'} rounded-md bg-white`} name="apellidos" />
          {errors.apellidos && <p className="text-xs text-red-600 mt-1">{errors.apellidos}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Teléfono<span className="text-red-500">*</span></label>
          <input ref={telefonoRef} defaultValue={form.telefono} readOnly={!editing} className={`w-full px-3 py-2 border ${errors.telefono ? 'border-red-400' : 'border-gray-300'} rounded-md bg-white`} name="telefono" />
          {errors.telefono && <p className="text-xs text-red-600 mt-1">{errors.telefono}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">DNI<span className="text-red-500">*</span></label>
          <input ref={dniRef} defaultValue={form.dni} readOnly={!editing} className={`w-full px-3 py-2 border ${errors.dni ? 'border-red-400' : 'border-gray-300'} rounded-md bg-white`} name="dni" />
          {errors.dni && <p className="text-xs text-red-600 mt-1">{errors.dni}</p>}
        </div>
      </div>
    </section>
  );
};

export default React.memo(SeccionInformacionPersonal);
