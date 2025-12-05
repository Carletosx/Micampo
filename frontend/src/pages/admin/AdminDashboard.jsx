import React from 'react'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="text-gray-600 mb-6">Bienvenido, {user?.email} (rol: {user?.role || user?.rol}).</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Usuarios</h2>
          <p className="text-sm text-gray-500">Gestión de perfiles y roles</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Pedidos</h2>
          <p className="text-sm text-gray-500">Monitoreo y estados</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Productos</h2>
          <p className="text-sm text-gray-500">Moderación y catálogo</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
