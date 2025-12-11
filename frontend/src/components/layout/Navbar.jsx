import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ROUTES from '../../routes/paths';
import Dropdown from '../ui/Dropdown';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white shadow-md w-full">
      {/* Banner superior */}
      <div className="bg-green-600 text-white text-center text-xs py-1 w-full">
        ¡ENVÍO GRATIS! Con el código de descuento 15% para tu primera compra
      </div>
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="text-2xl font-bold text-green-600">ORGANIC</Link>
          
          {/* Search Bar */}
          <div className="relative w-1/3">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              className="w-full p-2 pl-10 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link to={ROUTES.HOME} className="text-gray-700 hover:text-green-600">Inicio</Link>
            <Link to={ROUTES.CATALOG} className="text-gray-700 hover:text-green-600">Productos</Link>
            <Link to={ROUTES.ABOUT} className="text-gray-700 hover:text-green-600">Nosotros</Link>
            <Link to={ROUTES.CONTACT} className="text-gray-700 hover:text-green-600">Contacto</Link>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to={ROUTES.FAVORITES} className="text-gray-700 hover:text-green-600">
              <FaHeart />
            </Link>
            <Link to={ROUTES.CART} className="text-gray-700 hover:text-green-600">
              <FaShoppingCart />
            </Link>
            {user ? (
              <Dropdown
                trigger={
                  <span className="inline-flex items-center gap-3 px-3 py-2 rounded-full bg-gray-100 border border-gray-200 shadow-sm">
                    <Avatar name={user?.displayName} src={user?.avatarUrl} />
                    <span className="flex flex-col leading-tight">
                      <span className="text-sm font-medium text-gray-900">{user?.displayName}</span>
                      <span className="text-xs text-gray-500">{user?.role === 'AGRICULTOR' ? 'Agricultor' : (user?.role === 'ADMIN' ? 'Admin' : 'Comprador')}</span>
                    </span>
                  </span>
                }
                align="right"
              >
                {user?.role === 'AGRICULTOR' && (
                  <Link to={ROUTES.AGRICULTOR.DASHBOARD} className="block px-4 py-2 text-gray-800 hover:bg-green-50">Dashboard</Link>
                )}
                {user?.role === 'COMPRADOR' && (
                  <Link to={ROUTES.COMPRADOR_PERFIL} className="block px-4 py-2 text-gray-800 hover:bg-green-50">Mi Perfil</Link>
                )}
                <Button variant="dangerGhost" size="sm" className="w-full justify-start" onClick={logout}>Cerrar sesión</Button>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-3">
                <Link to={ROUTES.LOGIN} className="text-gray-700 hover:text-green-600">
                  <FaUser />
                </Link>
                <Link to={ROUTES.REGISTER} className="text-sm text-gray-700 hover:text-green-600">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
