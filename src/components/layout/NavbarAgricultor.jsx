import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

export default function NavbarAgricultor({ nombre = 'Juan Pérez', rol = 'Agricultor' }) {
  const linkClass = (isActive) =>
    `${isActive ? 'text-green-600 font-semibold border-b-2 border-green-600' : 'text-gray-700 hover:text-green-600 border-b-2 border-transparent'} pb-1`;

  const initials = nombre.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-40">
      {/* Banner superior para coherencia visual */}
      <div className="bg-green-600 text-white text-center text-xs py-1 w-full">
        Panel del Agricultor
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-green-600">ORGANIC</NavLink>

          {/* Links de navegación */}
          <div className="hidden md:flex space-x-6">
            <NavLink to="/agricultor/dashboard" className={({ isActive }) => linkClass(isActive)}>Inicio</NavLink>
            <NavLink to="/agricultor/productos" className={({ isActive }) => linkClass(isActive)}>Mis Productos</NavLink>
            <NavLink to="/agricultor/pedidos" className={({ isActive }) => linkClass(isActive)}>Pedidos</NavLink>
            <NavLink to="/agricultor/reportes" className={({ isActive }) => linkClass(isActive)}>Reportes</NavLink>
            <NavLink to="/agricultor/inventario" className={({ isActive }) => linkClass(isActive)}>Inventario</NavLink>
          </div>

          {/* Acciones/Perfil */}
          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <NavLink
              to="/agricultor/perfil?tab=notificaciones"
              aria-label="Ver notificaciones en Mi Perfil"
              className="relative text-gray-700 hover:text-green-600"
            >
              <FaBell />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">3</span>
            </NavLink>
            {/* Perfil */}
            <NavLink
              to="/agricultor/perfil"
              aria-label="Ir a Mi Perfil"
              className="flex items-center gap-2 hover:bg-gray-100 rounded-full px-2 py-1"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-800">{nombre}</div>
                <div className="text-xs text-gray-500">{rol}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}