import React, { useState, useEffect, useContext, useRef } from 'react'
import Button from '../ui/Button'
import { AuthContext } from '../../context/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

const SeccionCuentaAuth = () => {
  const { user, updateProfile } = useContext(AuthContext)
  const { showSuccess, showError } = useNotification()
  const [editing, setEditing] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const nombreRef = useRef(null)

  const nombre = user?.displayName || (user?.email || '').split('@')[0]
  const email = user?.email || ''

  useEffect(() => { setFormKey((k) => k + 1) }, [user?.displayName, user?.email])

  const handleSave = async () => {
    const nuevoNombre = nombreRef.current?.value?.trim() || ''
    if (!nuevoNombre) { showError('El nombre es obligatorio'); return }
    const { success, error } = await updateProfile({ nombre: nuevoNombre })
    if (success) { showSuccess('Nombre actualizado'); setEditing(false) } else { showError(error || 'No se pudo actualizar el nombre') }
  }

  const handleCancel = () => { setEditing(false); setFormKey((k) => k + 1) }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Datos de Cuenta (Autenticación)</h2>
        <div className="flex gap-2">
          {!editing && <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Editar</Button>}
          {editing && <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>}
          {editing && <Button variant="primary" size="sm" onClick={handleSave}>Guardar Cambios</Button>}
        </div>
      </div>
      <div key={formKey} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nombre de usuario</label>
          <input ref={nombreRef} defaultValue={nombre} readOnly={!editing} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" name="nombre" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Correo Electrónico</label>
          <input defaultValue={email} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700" name="email" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">El correo se gestiona en el servicio de autenticación y permanece de solo lectura aquí.</p>
    </section>
  )
}

export default React.memo(SeccionCuentaAuth)
