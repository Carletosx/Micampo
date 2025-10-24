import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

import FormularioContacto from '../../components/pago/FormularioContacto';
import SeccionDireccion from '../../components/pago/SeccionDireccion';
import MetodoEnvio from '../../components/pago/MetodoEnvio';
import MetodoPago from '../../components/pago/MetodoPago';
import ResumenPedido from '../../components/pago/ResumenPedido';

const PagoEnLinea = () => {
  const navigate = useNavigate();
  const { totalPrice } = useCart();

  // Estado del formulario (controlado por el contenedor para arquitectura limpia)
  const [contacto, setContacto] = useState({ nombre: '', apellido: '', email: '', telefono: '' });
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('casa');
  const [envio, setEnvio] = useState({ metodo: 'estandar', costo: 10 });
  const [pago, setPago] = useState({ metodo: 'tarjeta', tarjeta: { numero: '', nombre: '', vencimiento: '', cvv: '' } });
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Validaciones sencillas en tiempo real
  const errores = useMemo(() => {
    const errs = {};
    if (!contacto.nombre) errs.nombre = 'Requerido';
    if (!contacto.apellido) errs.apellido = 'Requerido';
    if (!contacto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto.email)) errs.email = 'Email inválido';
    if (!contacto.telefono || contacto.telefono.length < 9) errs.telefono = 'Teléfono inválido';

    if (pago.metodo === 'tarjeta') {
      const { numero, nombre, vencimiento, cvv } = pago.tarjeta;
      if (!/^[0-9]{16}$/.test(numero.replace(/\s/g, ''))) errs.numero = 'Número inválido';
      if (!nombre) errs.nombreTarjeta = 'Requerido';
      if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(vencimiento)) errs.vencimiento = 'MM/AA';
      if (!/^[0-9]{3}$/.test(cvv)) errs.cvv = 'CVV inválido';
    }
    return errs;
  }, [contacto, pago]);

  const subtotal = totalPrice || 0;
  const total = useMemo(() => (subtotal + (envio?.costo || 0)), [subtotal, envio]);

  const puedePagar = useMemo(() => aceptaTerminos && Object.keys(errores).length === 0, [aceptaTerminos, errores]);

  const confirmarPago = () => {
    if (!puedePagar) return;
    navigate('/comprador/confirmacion-pedido');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-6 text-sm">
        <Link to="/cart" className="flex items-center text-gray-600 hover:text-green-600"><FaShoppingCart className="mr-2"/>Carrito</Link>
        <span className="mx-3 text-gray-400">→</span>
        <div className="flex items-center text-green-700 font-semibold"><FaCreditCard className="mr-2"/>Pago</div>
        <span className="mx-3 text-gray-400">→</span>
        <div className="flex items-center text-gray-500"><FaCheckCircle className="mr-2"/>Confirmación</div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Finalizar Compra</h1>

      {/* Grid principal: formulario + resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: formulario */}
        <div className="lg:col-span-2 space-y-6">
          <FormularioContacto values={contacto} onChange={setContacto} errors={errores} />
          <SeccionDireccion selected={direccionSeleccionada} onSelect={setDireccionSeleccionada} />
          <MetodoEnvio value={envio} onChange={setEnvio} />
          <MetodoPago value={pago} onChange={setPago} errors={errores} />
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <label className="flex items-center space-x-3 text-sm">
              <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" checked={aceptaTerminos} onChange={e => setAceptaTerminos(e.target.checked)} />
              <span>Acepto los términos y condiciones y la política de privacidad</span>
            </label>
            <button onClick={confirmarPago} disabled={!puedePagar} className={`px-5 py-3 rounded-md text-white font-medium ${puedePagar ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}>Confirmar y Pagar</button>
          </div>
        </div>

        {/* Columna derecha: resumen */}
        <div className="lg:col-span-1">
          <ResumenPedido envioCosto={envio?.costo || 0} subtotal={subtotal} total={total} />
        </div>
      </div>
    </div>
  );
};

export default PagoEnLinea;