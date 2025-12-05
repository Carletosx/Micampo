import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ROUTES from '../../routes/paths'
import { AuthContext } from '../../context/AuthContext'

const CuentaLayout = () => {
  const { logout } = React.useContext(AuthContext)
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:sticky md:top-6">
            <Card title="Menú">
              <ul className="space-y-2 text-sm">
                <li>
                  <NavLink to={ROUTES.COMPRADOR_PERFIL} className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-green-100 text-green-800' : 'hover:bg-green-50 text-green-700'}`}>Perfil</NavLink>
                </li>
                <li>
                  <NavLink to={ROUTES.COMPRADOR_ORDENES} className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-green-100 text-green-800' : 'hover:bg-green-50 text-green-700'}`}>Mis compras</NavLink>
                </li>
                <li>
                  <NavLink to={ROUTES.COMPRADOR_DIRECCIONES} className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-green-100 text-green-800' : 'hover:bg-green-50 text-green-700'}`}>Direcciones</NavLink>
                </li>
                <li>
                  <NavLink to={ROUTES.COMPRADOR_METODOS_PAGO} className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-green-100 text-green-800' : 'hover:bg-green-50 text-green-700'}`}>Métodos de pago</NavLink>
                </li>
                <li>
                  <NavLink to={ROUTES.FAVORITES} className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-green-100 text-green-800' : 'hover:bg-green-50 text-green-700'}`}>Mis favoritos</NavLink>
                </li>
                <li>
                  <NavLink to={ROUTES.CART} className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-green-100 text-green-800' : 'hover:bg-green-50 text-green-700'}`}>Carrito</NavLink>
                </li>
                <li className="pt-2 border-t">
                  <Button variant="dangerGhost" className="w-full" onClick={handleLogout}>Cerrar sesión</Button>
                </li>
              </ul>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CuentaLayout
