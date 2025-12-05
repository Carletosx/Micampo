import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-12 pb-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <svg className="w-6 h-6 text-primary-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z" />
              </svg>
              <span className="text-primary-600 font-bold text-xl">ORGANIC</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Bienvenido a nuestra plataforma agrícola en línea. Aquí conectamos agricultores con compradores para ofrecer productos frescos y de calidad directamente del campo a tu mesa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">Inicio</Link></li>
              <li><Link to="/comprador/catalogo" className="text-gray-600 hover:text-primary-600 text-sm">Catálogo de Productos</Link></li>
              <li><Link to="/agricultor/dashboard" className="text-gray-600 hover:text-primary-600 text-sm">Zona de Agricultores</Link></li>
              <li><Link to="/auth/register" className="text-gray-600 hover:text-primary-600 text-sm">Registrarse</Link></li>
              <li><Link to="/auth/login" className="text-gray-600 hover:text-primary-600 text-sm">Iniciar Sesión</Link></li>
            </ul>
          </div>

          {/* Categorías */}
          <div className="col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li><Link to="/comprador/catalogo?categoria=frutas" className="text-gray-600 hover:text-primary-600 text-sm">Frutas</Link></li>
              <li><Link to="/comprador/catalogo?categoria=verduras" className="text-gray-600 hover:text-primary-600 text-sm">Verduras</Link></li>
              <li><Link to="/comprador/catalogo?categoria=lacteos" className="text-gray-600 hover:text-primary-600 text-sm">Lácteos</Link></li>
              <li><Link to="/comprador/catalogo?categoria=carnes" className="text-gray-600 hover:text-primary-600 text-sm">Carnes</Link></li>
              <li><Link to="/comprador/catalogo?categoria=organicos" className="text-gray-600 hover:text-primary-600 text-sm">Productos Orgánicos</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-1">
            <h3 className="text-gray-800 font-semibold mb-4">Contáctanos</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 text-sm">Av. Javier Prado Este 4200, Santiago de Surco, Lima - Perú</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-600 text-sm">(+51) 982 303 0123</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-gray-600 text-sm">contacto@organic.pe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6">
          <p className="text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} ORGANIC Marketplace. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;