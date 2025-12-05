import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { NotificationContext } from '../../contexts/NotificationContext'

const PerfilComprador = () => {
  const { user, updateProfile } = useContext(AuthContext)
  const { addNotification } = useContext(NotificationContext)
  const [nombre, setNombre] = React.useState(user?.displayName || '')
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || '')
  const [saving, setSaving] = React.useState(false)
  const onSave = async () => {
    setSaving(true)
    const res = await updateProfile({ nombre, avatarUrl })
    if (res?.success) addNotification('Perfil actualizado', 'success')
    else addNotification(res?.error || 'Error al actualizar perfil', 'error')
    setSaving(false)
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>
      <Card title="Información personal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <Input label="Nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <div><span className="font-medium">Correo:</span> {user?.email}</div>
          <div><span className="font-medium">Rol:</span> {user?.role || 'COMPRADOR'}</div>
          <Input label="Avatar URL" name="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </div>
        <div className="mt-4">
          <Button onClick={onSave} loading={saving}>Guardar cambios</Button>
        </div>
      </Card>
      <Card title="Resumen">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded bg-gray-50">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Pedidos</div>
          </div>
          <div className="text-center p-3 rounded bg-gray-50">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Favoritos</div>
          </div>
          <div className="text-center p-3 rounded bg-gray-50">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-600">Carrito</div>
          </div>
        </div>
      </Card>
    </>
  )
}

export default PerfilComprador
