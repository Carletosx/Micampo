import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ROUTES from '../../routes/paths'

const PerfilComprador = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>
      <Card title="Información personal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div><span className="font-medium">Nombre:</span> {user?.displayName}</div>
          <div><span className="font-medium">Correo:</span> {user?.email}</div>
          <div><span className="font-medium">Rol:</span> {user?.role || 'COMPRADOR'}</div>
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
