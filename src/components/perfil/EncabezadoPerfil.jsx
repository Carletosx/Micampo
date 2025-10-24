import React from 'react';

const EncabezadoPerfil = ({ title = 'Mi Perfil y Configuración', subtitle = 'Gestiona tu información personal y preferencias' }) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
};

export default React.memo(EncabezadoPerfil);