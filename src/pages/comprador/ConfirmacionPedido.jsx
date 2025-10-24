import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import ToastContainerCustom from '../../components/notifications/ToastContainer';

import MensajeExito from '../../components/confirmacion/MensajeExito';
import DetallesPedido from '../../components/confirmacion/DetallesPedido';
import ResumenCompra from '../../components/confirmacion/ResumenCompra';
import InformacionEntrega from '../../components/confirmacion/InformacionEntrega';
import EstadoPedido from '../../components/confirmacion/EstadoPedido';
import AccionesPedido from '../../components/confirmacion/AccionesPedido';

const ConfirmacionPedido = () => {
  const { cart, totalPrice } = useCart();
  const { user } = useAuth();
  const { showSuccess, showInfo } = useNotification();

  const orderId = useMemo(() => Math.floor(1000 + Math.random() * 9000), []);
  const didShowRef = useRef();

  useEffect(() => {
    if (didShowRef.current) return;
    didShowRef.current = true;
    showSuccess('¡Tu pedido ha sido confirmado!');
  }, []);

  const vendedor = { nombre: 'Finca Los Andes', ubicacion: 'Cusco, Perú' };

  const subtotal = totalPrice || 0;
  const envio = 10;
  const descuento = 0;
  const total = subtotal + envio - descuento;

  const direccion = {
    calle: 'Av. Los Álamos 123',
    ciudad: 'Lima',
    distrito: 'Miraflores',
    referencia: 'Frente al parque central'
  };

  const contacto = {
    nombre: user?.name || 'Cliente',
    telefono: '999 555 444',
    email: user?.email || 'cliente@example.com'
  };

  const metodoPago = 'Tarjeta de Crédito/Débito';
  const fechaEstimada = 'Entrega en 2 días';
  const estadoActual = 'Confirmado';

  const handleTrack = () => {
    showInfo('Funcionalidad de rastreo próximamente.');
  };

  const handleInvoice = () => {
    showInfo('Descarga de factura próximamente.');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Stepper */}
      <div className="bg-green-600 bg-opacity-80 py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-white text-sm">
            <Link to="/cart" className="flex items-center opacity-90">
              <FaShoppingCart className="mr-2" /> Carrito
            </Link>
            <span className="mx-3 opacity-70">→</span>
            <Link to="/checkout" className="flex items-center opacity-90">
              <FaCreditCard className="mr-2" /> Pago
            </Link>
            <span className="mx-3 opacity-70">→</span>
            <div className="flex items-center font-semibold">
              <FaCheckCircle className="mr-2" /> Confirmación
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Mensaje principal */}
        <MensajeExito orderId={orderId} email={contacto.email} />

        {/* Detalles y resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <DetallesPedido vendedor={vendedor} productos={cart} />
          <ResumenCompra subtotal={subtotal} envio={envio} descuento={descuento} total={total} />
        </div>

        {/* Información de entrega y estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <InformacionEntrega direccion={direccion} contacto={contacto} metodoPago={metodoPago} fechaEstimada={fechaEstimada} />
          <EstadoPedido estadoActual={estadoActual} />
        </div>

        {/* Acciones */}
        <AccionesPedido onTrack={handleTrack} onInvoice={handleInvoice} />

        {/* Banner de ayuda */}
        <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-md text-sm flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          <div>
            <p className="font-medium">¿Necesitas ayuda con tu pedido?</p>
            <p className="text-xs text-yellow-700">Contacta a nuestro equipo de soporte. Estamos atentos a cualquier consulta.</p>
          </div>
          <div className="ml-auto">
            <Link to="/contact" className="text-yellow-900 font-medium hover:underline">Contactar soporte</Link>
          </div>
        </div>

        {/* Navegación final */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
          <Link to="/" className="px-5 py-3 rounded-md bg-green-600 text-white hover:bg-green-700">Volver al Inicio</Link>
          <Link to="/dashboard" className="px-5 py-3 rounded-md bg-white border border-green-600 text-green-700 hover:bg-green-50">Ver Mis Pedidos</Link>
          <Link to="/catalog" className="px-5 py-3 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Seguir Comprando</Link>
        </div>
      </div>

      {/* Contenedor de Toasts personalizados */}
      <ToastContainerCustom />
    </div>
  );
};

export default ConfirmacionPedido;