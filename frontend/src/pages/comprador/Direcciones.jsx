import { useState, useEffect } from 'react'
import { SkeletonCard } from '../../components/ui/Skeleton'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { listDirecciones, createDireccion, deleteDireccion } from '../../api/users.js'

const Direcciones = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ tipo: 'CASA', linea1: '', linea2: '', distrito: '', provincia: '', departamento: '', referencia: '', latitud: '', longitud: '' })
  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const load = async () => {
    setLoading(true)
    const r = await listDirecciones()
    if (r.ok && Array.isArray(r.data)) setItems(r.data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const submit = async () => {
    setSaving(true)
    const payload = {
      tipo: form.tipo,
      linea1: form.linea1,
      linea2: form.linea2 || null,
      distrito: form.distrito,
      provincia: form.provincia,
      departamento: form.departamento,
      referencia: form.referencia || null,
      latitud: form.latitud ? Number(form.latitud) : null,
      longitud: form.longitud ? Number(form.longitud) : null
    }
    const r = await createDireccion(payload)
    if (r.ok) {
      setShowForm(false)
      setForm({ tipo: 'CASA', linea1: '', linea2: '', distrito: '', provincia: '', departamento: '', referencia: '', latitud: '', longitud: '' })
      await load()
    }
    setSaving(false)
  }
  const remove = async (id) => {
    const r = await deleteDireccion(id)
    if (r.ok) await load()
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Direcciones</h1>
        {loading ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><SkeletonCard /><SkeletonCard /></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Mis direcciones</h2>
              <Button onClick={()=> setShowForm(s => !s)}>{showForm ? 'Cerrar' : 'Agregar dirección'}</Button>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-gray-700">Aún no has agregado direcciones.</p>
            ) : (
              <div className="space-y-3">
                {items.map(d => (
                  <div key={d.id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{d.tipo}</div>
                      <div className="text-sm text-gray-600">{[d.linea1, d.linea2, d.distrito, d.provincia, d.departamento].filter(Boolean).join(', ')}</div>
                      {d.referencia && <div className="text-xs text-gray-500">{d.referencia}</div>}
                    </div>
                    <button className="text-xs text-red-600" onClick={()=> remove(d.id)}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}
            {showForm && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select value={form.tipo} onChange={e=> onChange('tipo', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="CASA">Casa</option>
                      <option value="OFICINA">Oficina</option>
                    </select>
                  </div>
                  <Input label="Distrito" name="distrito" value={form.distrito} onChange={e=> onChange('distrito', e.target.value)} />
                  <Input label="Provincia" name="provincia" value={form.provincia} onChange={e=> onChange('provincia', e.target.value)} />
                  <Input label="Departamento" name="departamento" value={form.departamento} onChange={e=> onChange('departamento', e.target.value)} />
                </div>
                <Input label="Dirección (línea 1)" name="linea1" value={form.linea1} onChange={e=> onChange('linea1', e.target.value)} />
                <Input label="Dirección (línea 2)" name="linea2" value={form.linea2} onChange={e=> onChange('linea2', e.target.value)} />
                <Input label="Referencia" name="referencia" value={form.referencia} onChange={e=> onChange('referencia', e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Latitud" name="latitud" value={form.latitud} onChange={e=> onChange('latitud', e.target.value)} />
                  <Input label="Longitud" name="longitud" value={form.longitud} onChange={e=> onChange('longitud', e.target.value)} />
                </div>
                <div>
                  <Button onClick={submit} loading={saving}>Guardar dirección</Button>
                </div>
              </div>
            )}
          </div>
        </div>)}
      </div>
    </div>
  )
}

export default Direcciones
