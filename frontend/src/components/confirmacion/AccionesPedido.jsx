import React from 'react';
import { FaFileInvoice, FaMapMarkedAlt } from 'react-icons/fa';

const AccionesPedido = ({ onTrack, onInvoice }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4">
      <button onClick={onTrack} className="w-full md:w-auto px-5 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2">
        <FaMapMarkedAlt />
        <span>Rastrear Pedido</span>
      </button>
      <button onClick={onInvoice} className="w-full md:w-auto px-5 py-3 rounded-md bg-white border border-green-600 text-green-700 hover:bg-green-50 flex items-center justify-center gap-2">
        <FaFileInvoice />
        <span>Descargar Factura</span>
      </button>
    </div>
  );
};

export default AccionesPedido;