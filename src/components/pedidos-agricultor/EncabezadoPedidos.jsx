import React from 'react';

const EncabezadoPedidos = ({
  titulo = 'Gestión de Pedidos',
  subtitulo = 'Administra y da seguimiento a todos tus pedidos'
}) => {
  return (
    <div className="mb-4">
      <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-5">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{titulo}</h1>
        <p className="mt-1 text-sm md:text-base text-gray-700">{subtitulo}</p>
      </div>
    </div>
  );
};

export default EncabezadoPedidos;