import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const MensajeExito = ({ orderId, email }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">¡Pedido Realizado con Éxito!</h1>
      <p className="text-gray-600 mb-4">Gracias por tu compra. Tu pedido ha sido confirmado y está siendo procesado.</p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-3">
        <span className="text-sm text-gray-500">Pedido</span>
        <span className="text-green-700 font-semibold">#{orderId}</span>
      </div>
      {email && (
        <p className="text-xs md:text-sm text-gray-500 mt-3">Se envió un correo de confirmación a <span className="font-medium text-gray-700">{email}</span></p>
      )}
    </div>
  );
};

export default MensajeExito;