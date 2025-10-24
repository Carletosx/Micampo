import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
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
          <Link to="/" className="text-2xl font-bold text-green-600">ORGANIC</Link>
          
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
            <Link to="/" className="text-gray-700 hover:text-green-600">Inicio</Link>
            <Link to="/catalog" className="text-gray-700 hover:text-green-600">Productos</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600">Nosotros</Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600">Contacto</Link>
          </div>
          
          {/* User Actions */}
          <div className="flex space-x-4">
            <Link to="/favorites" className="text-gray-700 hover:text-green-600">
              <FaHeart />
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-green-600">
              <FaShoppingCart />
            </Link>
            {currentUser ? (
              <div className="relative group">
                <button className="text-gray-700 hover:text-green-600">
                  <FaUser />
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white border rounded shadow-xl hidden group-hover:block z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-green-100">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-green-100">
                    Mi Perfil
                  </Link>
                  <button 
                    onClick={logout} 
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-green-600">
                <FaUser />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;