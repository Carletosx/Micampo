import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const BannerBienvenida = ({
  nombre = 'Juan',
  subtitulo = 'Aquí tienes un resumen de tu actividad reciente'
}) => {
  return (
    <div className="rounded-xl p-6 text-white bg-gradient-to-r from-green-600 via-green-500 to-green-600 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">¡Bienvenido de vuelta, {nombre}! 👋</h2>
          <p className="mt-1 text-green-100">{subtitulo}</p>
        </div>
        <Link
          to="/agricultor/productos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-md shadow hover:bg-green-50 transition"
          aria-label="Publicar nuevo producto"
        >
          <FaPlus />
          <span>+ Publicar Producto</span>
        </Link>
      </div>
    </div>
  );
};

export default BannerBienvenida;