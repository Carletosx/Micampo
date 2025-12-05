import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBox, FaClipboardList, FaChartBar, FaWarehouse, FaBell, FaChevronDown } from 'react-icons/fa';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ` +
      (isActive ? 'bg-white/15 text-white' : 'text-green-100 hover:bg-white/10 hover:text-white')
    }
    aria-label={label}
  >
    <Icon className="text-base" />
    <span>{label}</span>
  </NavLink>
);

const NavbarAgricultor = ({ nombrePerfil = 'Juan Pérez - Agricultor' }) => {
  return (
    <nav aria-label="Navegación Agricultor" className="sticky top-0 z-40 bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Enlaces */}
          <div className="flex items-center gap-2">
            <NavItem to="/agricultor/dashboard" icon={FaHome} label="Inicio" />
            <NavItem to="/agricultor/productos" icon={FaBox} label="Mis Productos" />
            <NavItem to="/agricultor/pedidos" icon={FaClipboardList} label="Pedidos" />
            <NavItem to="/agricultor/reportes" icon={FaChartBar} label="Reportes" />
            <NavItem to="/agricultor/inventario" icon={FaWarehouse} label="Inventario" />
          </div>

          {/* Acciones derecha */}
          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Notificaciones"
            >
              <FaBell className="text-lg" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">3</span>
            </button>

            {/* Perfil */}
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544723795-3fb6469f9fcd?auto=format&fit=crop&w=80&q=80"
                alt="Perfil"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
              />
              <div className="hidden sm:block">
                <div className="text-xs leading-tight opacity-90">{nombrePerfil}</div>
              </div>
              <FaChevronDown className="opacity-75" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAgricultor;