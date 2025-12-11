import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useNotification } from '../../contexts/NotificationContext'
import { listFincas, createFinca, updateFinca } from '../../api/users.js'
import Button from '../ui/Button'

const SeccionInformacionFinca = () => {
  const { showSuccess, showError } = useNotification();

  const initial = useMemo(() => ({ id: null, nombre: '', ubicacion: '', areaHa: '', certificacion: '', descripcion: '' }), [])

  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [formKey, setFormKey] = useState(0)
  const [editing, setEditing] = useState(false)
  const nombreRef = useRef(null)
  const ubicacionRef = useRef(null)
  const areaHaRef = useRef(null)
  const certificacionRef = useRef(null)
  const descripcionRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      const { ok, data, unauthorized } = await listFincas(0, 1)
      if (unauthorized) { showError('Tu sesión expiró.'); return }
      if (ok && Array.isArray(data) && data.length) {
        const f = data[0]
        setForm({ id: f.id, nombre: f.nombre || '', ubicacion: f.ubicacion || '', areaHa: f.areaHa || '', certificacion: f.certificacion || '', descripcion: f.descripcion || '' })
      } else {
        setForm(initial)
      }
    }
    load()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.nombre?.trim()) e.nombre = 'Nombre de la Finca es obligatorio'
    if (!form.ubicacion?.trim()) e.ubicacion = 'Ubicación es obligatoria'
    if (!form.descripcion?.trim()) e.descripcion = 'Descripción es obligatoria'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const [saving, setSaving] = useState(false)
  const handleSave = async () => {
    const payload = { nombre: nombreRef.current?.value || '', ubicacion: ubicacionRef.current?.value || '', areaHa: areaHaRef.current?.value ? Number(areaHaRef.current?.value) : null, certificacion: certificacionRef.current?.value || '', descripcion: descripcionRef.current?.value || '' }
    setErrors({})
    if (!payload.nombre.trim() || !payload.ubicacion.trim() || !payload.descripcion.trim()) { showError('Revisa los campos marcados.'); return }
    setSaving(true)
    console.log('Guardar finca payload', payload)
    const res = form.id ? await updateFinca(form.id, payload) : await createFinca(payload)
    setSaving(false)
    console.log('Respuesta finca', res)
    if (res.unauthorized) { showError('Tu sesión expiró.'); return }
    if (res.ok) { showSuccess('Información de la finca actualizada.'); setEditing(false); if (!form.id && res.data?.id) setForm((prev) => ({ ...prev, id: res.data.id })) } else showError('No se pudo guardar la finca')
  }

  const handleCancel = () => { setForm(initial); setErrors({}); setFormKey((k) => k + 1); setEditing(false) }

  const Field = ({ label, name, value, onChange, type = 'text', required }) => (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-400' : 'border-gray-300'} rounded-md bg-white`}
      />
      {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Información de la Finca</h2>
        <div className="flex gap-2">
          {!editing && <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Editar</Button>}
          {editing && <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>}
          {editing && <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>Guardar Cambios</Button>}
        </div>
      </div>
      <div key={formKey} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nombre de la Finca<span className="text-red-500">*</span></label>
          <input ref={nombreRef} defaultValue={form.nombre} readOnly={!editing} className={`w-full px-3 py-2 border ${errors.nombre ? 'border-red-400' : 'border-gray-300'} rounded-md bg-white`} name="nombre" />
          {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Ubicación<span className="text-red-500">*</span></label>
          <input ref={ubicacionRef} defaultValue={form.ubicacion} readOnly={!editing} className={`w-full px-3 py-2 border ${errors.ubicacion ? 'border-red-400' : 'border-gray-300'} rounded-md bg-white`} name="ubicacion" />
          {errors.ubicacion && <p className="text-xs text-red-600 mt-1">{errors.ubicacion}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Área (ha)</label>
          <input ref={areaHaRef} defaultValue={form.areaHa} type="number" readOnly={!editing} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" name="areaHa" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Certificación</label>
          <input ref={certificacionRef} defaultValue={form.certificacion} readOnly={!editing} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" name="certificacion" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Descripción<span className="text-red-500">*</span></label>
          <textarea ref={descripcionRef} defaultValue={form.descripcion} rows={4} readOnly={!editing} className={`w-full rounded-md border px-3 py-2 ${errors.descripcion ? 'border-red-400' : 'border-gray-300'} bg-white`} name="descripcion" />
          {errors.descripcion && <p className="text-xs text-red-600 mt-1">{errors.descripcion}</p>}
        </div>
      </div>
    </section>
  );
};

export default React.memo(SeccionInformacionFinca);
