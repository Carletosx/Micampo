import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, totalItems } = useCart();
  
  // Escuchar el evento personalizado para abrir el carrito
  useEffect(() => {
    const handleToggleCartEvent = () => {
      setIsCartOpen(true);
    };
    
    document.addEventListener('toggleCart', handleToggleCartEvent);
    
    return () => {
      document.removeEventListener('toggleCart', handleToggleCartEvent);
    };
  }, []);
  
  const toggleCart = () => {
    console.log("Toggling cart sidebar:", !isCartOpen);
    setIsCartOpen(!isCartOpen);
  };

  // Asegurar que el sidebar se cierre cuando se navega a otra página
  useEffect(() => {
    const handleRouteChange = () => {
      setIsCartOpen(false);
    };
    
    handleRouteChange();
    
    // No es necesario retornar una función de limpieza aquí
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/comprador/catalogo?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Banner superior */}
      <div className="bg-primary-600 text-white text-center text-xs py-1">
        ¡ENVÍO GRATIS! Con el código de descuento 15% para tu primera compra
      </div>
      
      {/* Contenido principal del header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <svg className="w-6 h-6 text-primary-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z" />
            </svg>
            <span className="text-primary-600 font-bold text-2xl">ORGANIC</span>
          </Link>
          
          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="flex-grow max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar Productos Aquí..."
                className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-primary-600 text-white rounded-r-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
          
          {/* Iconos de usuario y carrito */}
          <div className="flex items-center space-x-4">
            <Link to="/auth/login" className="text-gray-700 hover:text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Botón del carrito clickeado");
                setIsCartOpen(true);
              }} 
              className="text-gray-700 hover:text-primary-600 relative cursor-pointer"
              aria-label="Ver carrito"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Navegación */}
      <nav className="bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-6 justify-center">
            <li>
              <Link to="/" className="text-gray-700 hover:text-primary-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/comprador/catalogo" className="text-gray-700 hover:text-primary-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Productos
              </Link>
            </li>
            <li>
              <Link to="/agricultor/dashboard" className="text-gray-700 hover:text-primary-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Agricultores
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      {/* Barra lateral del carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay de fondo oscuro */}
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={toggleCart}
            ></div>
            
            {/* Panel lateral */}
            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  {/* Encabezado */}
                  <div className="flex items-center justify-between px-4 py-4 bg-green-600 text-white">
                    <h2 className="text-lg font-medium">Carrito de compras</h2>
                    <button 
                      onClick={toggleCart}
                      className="text-white hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Contenido del carrito */}
                  <div className="flex-1 py-6 px-4 sm:px-6 overflow-auto">
                    {cart.length === 0 ? (
                      <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Tu carrito está vacío</h3>
                        <p className="mt-1 text-sm text-gray-500">Comienza a agregar productos a tu carrito</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {cart.map((item) => (
                          <li key={item.cartItemId || item.id} className="py-4 flex">
                            <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-center object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3 className="text-sm font-semibold">{item.name}</h3>
                                  <p className="ml-4 text-green-600 font-semibold">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Cantidad: {item.quantity}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Footer con total y botón de checkout */}
                  {cart.length > 0 && (
                    <div className="border-t border-gray-200 py-4 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                        <p>Subtotal</p>
                        <p className="text-green-600 font-semibold">S/ {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 mb-4">Envío y impuestos calculados al finalizar la compra.</p>
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            toggleCart();
                            navigate('/cart');
                          }}
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          Ir al Carrito
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;