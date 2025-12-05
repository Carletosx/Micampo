import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center text-sm text-gray-700">
    <Icon className="text-green-600 mr-2" />
    <span className="font-medium mr-1">{label}:</span>
    <span>{value}</span>
  </div>
);

const InformacionEntrega = ({ direccion, contacto, metodoPago, fechaEstimada }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Información de Entrega</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <InfoRow icon={FaMapMarkerAlt} label="Dirección" value={`${direccion?.calle}, ${direccion?.distrito}, ${direccion?.ciudad}`} />
          {direccion?.referencia && (
            <div className="text-xs text-gray-500">Referencia: {direccion.referencia}</div>
          )}
        </div>
        <div className="space-y-2">
          {contacto?.telefono && (
            <InfoRow icon={FaPhoneAlt} label="Contacto" value={`${contacto.nombre} - ${contacto.telefono}`} />
          )}
          {contacto?.email && (
            <InfoRow icon={FaEnvelope} label="Email" value={contacto.email} />
          )}
          {metodoPago && (
            <InfoRow icon={FaCreditCard} label="Método de Pago" value={metodoPago} />
          )}
          {fechaEstimada && (
            <InfoRow icon={FaCalendarAlt} label="Entrega Estimada" value={fechaEstimada} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InformacionEntrega;